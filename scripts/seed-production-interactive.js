// scripts/seed-production-interactive.js
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const prompts = require('prompts'); // Interactive UI
const { createClient } = require('@supabase/supabase-js');

// --- 1. CONFIGURATION & ENV LOADING ---
// Load .env from ROOT directory (up one level from scripts/)
const envPath = path.resolve(__dirname, '../.env');
require('dotenv').config({ path: envPath });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY; // Must be SERVICE ROLE

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    console.error("❌ Error: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
    process.exit(1);
}

// Init Admin Client
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
});

// --- FILE PATHS (Relative to Root) ---
const RAZORPAY_FILE = path.join(__dirname, '../seed/data-razorypay.json');

// Fix the spaces in the CSV filename here:
const CSV_FILE = path.join(__dirname, '../seed/enrolled_students_clean_phone_consistent - Enrolled Students.csv');

// Ensure output directory exists before writing
const OUTPUT_DIR = path.join(__dirname, '../seed/out');
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const OUTPUT_CREDS = path.join(OUTPUT_DIR, 'generated_credentials.csv');
const OUTPUT_MISSING = path.join(OUTPUT_DIR, 'missing_data_report.json');

// Output file paths for reference
console.log("📁 Input files:");
console.log("   - Razorpay:", RAZORPAY_FILE);
console.log("   - CSV:", CSV_FILE);
console.log("📁 Output files:");
console.log("   - Credentials:", OUTPUT_CREDS);
console.log("   - Missing data:", OUTPUT_MISSING);
// --- HELPERS ---
const normalizePhone = (phone) => {
    if (!phone) return null;
    let p = String(phone).replace(/[\s\-\+]/g, ''); // Remove spaces, dashes, +
    if (p.startsWith('91') && p.length > 10) p = p.substring(2);
    return p;
};

const normalizeEmail = (email) => String(email).toLowerCase().trim();

const generatePassword = (name, phone) => {
    // Strategy: FirstWordOfName + Last4DigitsOfPhone (or Random)
    // Example: "Ravi Kumar" (9876543210) -> "Ravi3210"
    const cleanName = name ? name.split(' ')[0].replace(/[^a-zA-Z]/g, '') : "Student";
    const suffix = phone ? phone.slice(-4) : Math.floor(1000 + Math.random() * 9000);
    // Ensure capital letter for strength requirements
    const prefix = cleanName.charAt(0).toUpperCase() + cleanName.slice(1).toLowerCase();
    return `${prefix}@${suffix}`;
};

// --- MAIN FUNCTION ---
async function main() {
    console.clear();
    console.log("\x1b[36m%s\x1b[0m", "🚀 Wisdom Abacus: Intelligent Migration Tool");
    console.log("==============================================\n");

    // 1. FETCH COMPETITIONS
    console.log("... Fetching active competitions from Supabase ...");
    const { data: competitions, error: compError } = await supabase
        .from('competitions')
        .select('id, title, exam_date')
        .in('status', ['upcoming', 'open'])// Or remove filter to see all
        .order('created_at', { ascending: false });

    if (compError) {
        console.error("❌ Failed to fetch competitions:", compError.message);
        process.exit(1);
    }

    if (!competitions || competitions.length === 0) {
        console.error("❌ No upcoming competitions found in database.");
        process.exit(1);
    }

    // 2. INTERACTIVE SELECTION
    const response = await prompts({
        type: 'select',
        name: 'competitionId',
        message: 'Select the Target Competition for Enrollment:',
        choices: competitions.map(c => ({
            title: `${c.title} (${new Date(c.exam_date).toLocaleDateString()})`,
            value: c.id
        })),
    });

    if (!response.competitionId) {
        console.log("🚫 Operation cancelled.");
        process.exit(0);
    }

    const TARGET_COMPETITION_ID = response.competitionId;
    console.log(`\n✅ Target Set: ${TARGET_COMPETITION_ID}\n`);

    // 3. LOAD DATA
    if (!fs.existsSync(RAZORPAY_FILE) || !fs.existsSync(CSV_FILE)) {
        console.error("❌ Error: Input files (data-razorypay.json or CSV) not found in root.");
        process.exit(1);
    }

    const razorpayRaw = JSON.parse(fs.readFileSync(RAZORPAY_FILE, 'utf8'));
    const csvRaw = fs.readFileSync(CSV_FILE, 'utf8');
    const payments = razorpayRaw.items.filter(p => p.status === 'captured');

    const students = parse(csvRaw, { columns: true, skip_empty_lines: true });

    // Index Students
    const studentMap = new Map();
    students.forEach(s => {
        if (s.Email) studentMap.set(normalizeEmail(s.Email), s);
        if (s.Phone) studentMap.set(normalizePhone(s.Phone), s);
    });

    const credentialsList = [];
    const missingProfiles = [];
    let successCount = 0;

    console.log(`Processing ${payments.length} Payments...`);

    // 4. MIGRATE
    for (const payment of payments) {
        try {
            const email = normalizeEmail(payment.email);
            const phone = normalizePhone(payment.contact);

            // Match Profile
            const profileData = studentMap.get(email) || studentMap.get(phone);
            const isProfileComplete = !!profileData;

            const studentName = profileData ? profileData['Student Name'] : "Student";
            const customPassword = generatePassword(studentName, phone);

            // Create/Get Auth User
            // IMPORTANT: Do NOT set phone on auth.users - phone is NOT unique
            // Multiple siblings can share the same parent phone number
            // Each student is uniquely identified by email only
            let userId;
            const { data: authData, error: createError } = await supabase.auth.admin.createUser({
                email: email,
                password: customPassword,
                email_confirm: true,
                // DO NOT pass phone to auth.users - it would create unique constraint issue
                // Phone will be stored in profiles table (which now allows duplicates)
                user_metadata: { full_name: studentName, imported: true }
            });

            if (createError) {
                // If user exists (duplicate email), find their ID
                if (createError.message.includes('already been registered') ||
                    createError.message.includes('already exists') ||
                    createError.code === 'email_exists') {
                    // Query profiles table directly instead of paginated listUsers()
                    const { data: existingProfile, error: profileError } = await supabase
                        .from('profiles')
                        .select('id')
                        .eq('email', email)
                        .single();
                    
                    if (existingProfile) {
                        userId = existingProfile.id;
                        // User already exists, we can still process their payment/enrollment
                    } else {
                        console.error(`\n   ⚠️ Could not find existing profile for: ${email}`);
                    }
                } else {
                    // Unexpected error - log it
                    console.error(`\n   ❌ Auth Error for ${email}: ${createError.message}`);
                }
            } else {
                userId = authData.user.id;
                // Only push to credentials CSV if it's a NEW account with a KNOWN password
                credentialsList.push({ email, password: customPassword, name: studentName, phone: phone });
            }

            if (!userId) {
                console.error(`\n   ⚠️ Skipping payment ${payment.id} - no user ID for: ${email}`);
                continue;
            }

            // Upsert Profile
            await supabase.from('profiles').upsert({
                id: userId,
                uid: `WM-${Math.floor(1000 + Math.random() * 9000)}`,
                email: email,
                phone: phone,
                auth_provider: 'email',
                student_name: studentName,
                parent_name: profileData?.['Parent Name'] || null,
                student_grade: profileData ? parseInt(profileData['Grade']) : null,
                school_name: profileData?.['School Name'] || null,
                city: profileData?.['City'] || null,
                state: profileData?.['State'] || null,
                is_profile_complete: isProfileComplete,
                status: 'active',
                role: 'user',
                updated_at: new Date()
            });

            // Insert Payment
            const { data: payData, error: payError } = await supabase.from('payments').insert({
                user_id: userId,
                amount: payment.amount,
                currency: payment.currency,
                status: 'SUCCESS',
                gateway: 'RAZORPAY',
                razorpay_payment_id: payment.id,
                razorpay_order_id: payment.order_id,
                purpose: 'COMPETITION_ENROLLMENT',
                reference_id: TARGET_COMPETITION_ID,
                created_at: new Date(payment.created_at * 1000).toISOString()
            }).select().single();

            // Insert Enrollment (Only if payment succeeded or existed)
            if (!payError || payError.code === '23505') { // 23505 = Unique violation (already exists)
                // Find payment ID if insert failed
                let payId = payData?.id;
                if (!payId) {
                    const { data: existingPay } = await supabase.from('payments')
                        .select('id').eq('razorpay_payment_id', payment.id).single();
                    payId = existingPay?.id;
                }

                if (payId) {
                    await supabase.from('enrollments').upsert({
                        user_id: userId,
                        competition_id: TARGET_COMPETITION_ID,
                        payment_id: payId,
                        status: 'confirmed',
                        is_payment_confirmed: true,
                        competition_snapshot: { fee: payment.amount / 100 },
                        user_snapshot: { name: studentName },
                        created_at: new Date(payment.created_at * 1000).toISOString()
                    }, { onConflict: 'user_id, competition_id' });
                }
            }

            if (!isProfileComplete) missingProfiles.push({ email, phone });
            successCount++;
            process.stdout.write(`\r✅ Processed: ${successCount}/${payments.length}`);

        } catch (err) {
            console.error(`\n❌ Error with ${payment.email}: ${err.message}`);
        }
    }

    // 5. OUTPUT
    console.log("\n\n📊 Generating Reports...");

    const csvHeader = "Email,Password,Student Name\n";
    const csvRows = credentialsList.map(c => `${c.email},${c.password},"${c.name}"`).join("\n");
    fs.writeFileSync(OUTPUT_CREDS, csvHeader + csvRows);

    if (missingProfiles.length > 0) {
        fs.writeFileSync(OUTPUT_MISSING, JSON.stringify(missingProfiles, null, 2));
        console.log(`⚠️  Warning: ${missingProfiles.length} users have missing profiles (Saved to missing_data_report.json)`);
    }

    console.log(`\n🎉 Success! Credentials saved to: generated_credentials.csv`);
}

main().catch(console.error);
