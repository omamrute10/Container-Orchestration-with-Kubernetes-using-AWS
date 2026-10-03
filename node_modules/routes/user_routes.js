var express = require("express");
var exe = require("./../connection");
var router = express.Router();
// Add this near the top if not already present
router.use(express.json());
const prefix = "kanak-digifex-mumbai-mira-road-ahilyanagar-"


router.get("/", async function (req, res) {
    var data = await exe('SELECT * FROM basic_info');
    var about_card_data = await exe(`SELECT * FROM about_card_section`);
    var about_kanak = await exe(`SELECT * FROM about_kanak_digifex`)
    var offered_courses = await exe(`SELECT * FROM offered_courses`);
    var course_info = await exe(`SELECT * FROM courses`);
    var business_info = await exe(`SELECT * FROM business_solution`);
    var digifex = await exe(`SELECT * FROM why_kanak_digifex`);
    var company_policy = await exe(`SELECT * FROM company_policy`);
    var product = await exe(`SELECT * FROM product`);
    var reviews = await exe('SELECT * FROM customer_reviews');
    var office = await exe('SELECT * FROM office_address');
    var institute_name = await exe(`SELECT * FROM user_footer`);
    var disclaimer = await exe(`SELECT * FROM disclaimer`);
    var home_banner = await exe(`SELECT * FROM home_banner`);
    var employee = await exe(`SELECT * FROM our_team`);
    var services = await exe(
    "SELECT * FROM services WHERE status='Active'");
    
    



    var obj = {
        "company_info": data[0],
        "about_card": about_card_data,
        "about_kanak": about_kanak[0],
        "offered_courses": offered_courses[0],
        "course_info": course_info,
        "business_info": business_info,
        "digifex": digifex[0],
        "company_policy": company_policy,
        "product": product,
        "reviews": reviews,
        "office": office,
        "institute_name": institute_name,
        "disclaimer": disclaimer,
        "employee": employee,
        "home_banner": home_banner,
        "services": services,
        
    };
    res.render("user/index.ejs", obj);
});

router.get("/about", async function (req, res) {
    var data = await exe('SELECT * FROM basic_info');
    var about = await exe(`SELECT * FROM about_us`);
    var employee = await exe(`SELECT * FROM our_team`);
    var office = await exe('SELECT * FROM office_address');
    var institute_name = await exe(`SELECT * FROM user_footer`);
    var disclaimer = await exe(`SELECT * FROM disclaimer`);

    var obj = {
        "company_info": data[0],
        "about": about,
        "employee": employee,
        "office": office,
        "institute_name": institute_name,
        "disclaimer": disclaimer
    };
    res.render("user/about.ejs", obj);
});

router.get("/our-team", async function (req, res) {
    var data = await exe('SELECT * FROM basic_info');
    var about = await exe(`SELECT * FROM about_us`);
    var employee = await exe(`SELECT * FROM our_team`);
    var office = await exe('SELECT * FROM office_address');
    var institute_name = await exe(`SELECT * FROM user_footer`);
    var disclaimer = await exe(`SELECT * FROM disclaimer`);

    var obj = {
        "company_info": data[0],
        "about": about,
        "employee": employee,
        "office": office,
        "institute_name": institute_name,
        "disclaimer": disclaimer
    };
    res.render("user/our-team.ejs", obj);
});

router.get("/courses", async function (req, res) {
    var data = await exe('SELECT * FROM basic_info');
    var courses = await exe(`SELECT * FROM courses`);
    var office = await exe('SELECT * FROM office_address');
    var institute_name = await exe(`SELECT * FROM user_footer`);
    var disclaimer = await exe(`SELECT * FROM disclaimer`);
    var course_info = await exe(`SELECT * FROM courses`);

    var obj = {
        "company_info": data[0],
        "courses": courses,
        "office": office,
        "institute_name": institute_name,
        "disclaimer": disclaimer,
        "course_info": course_info,
    };
    res.render("user/courses.ejs", obj);
});

// For Students - Static Page
router.get("/forstudents", function (req, res) {
    res.render("user/forstudents.ejs");
});

// For Corporate Proffessionals - Static Page
router.get("/forproffessionals", function (req, res) {
    res.render("user/forproffessionals.ejs");
});

router.get("/clients", async function (req, res) {
    var data = await exe('SELECT * FROM basic_info');
    var associates = await exe(`SELECT * FROM associates`);
    var office = await exe('SELECT * FROM office_address');
    var institute_name = await exe(`SELECT * FROM user_footer`);
    var disclaimer = await exe(`SELECT * FROM disclaimer`);

    var obj = {
        "company_info": data[0],
        "associates": associates,
        "office": office,
        "institute_name": institute_name,
        "disclaimer": disclaimer
    };
    res.render("user/clients.ejs", obj);
});

router.get("/clients2", async function (req, res) {
    var data = await exe('SELECT * FROM basic_info');
    var office = await exe('SELECT * FROM office_address');
    var institute_name = await exe(`SELECT * FROM user_footer`);
    var disclaimer = await exe(`SELECT * FROM disclaimer`);

    // Fetch entries from the verified 'clients' table
    var clients_data = await exe("SELECT * FROM clients WHERE status = '1' OR status = 'Active'");

    var obj = {
        "company_info": data[0],
        "office": office,
        "institute_name": institute_name,
        "disclaimer": disclaimer,
        
        // 🌟 CRITICAL: This key MUST be named "clients" to match your clients2.ejs file variables!
        "clients": clients_data 
    };
    
    // Renders your chosen clients2.ejs view template
    res.render("user/clients2.ejs", obj);
});

router.get("/gallery", async function (req, res) {
    var data = await exe('SELECT * FROM basic_info');
    var gallery = await exe(`SELECT * FROM gallery`);
    var office = await exe('SELECT * FROM office_address');
    var institute_name = await exe(`SELECT * FROM user_footer`);
    var disclaimer = await exe(`SELECT * FROM disclaimer`);

    var obj = {
        "company_info": data[0],
        "gallery": gallery,
        "office": office,
        "institute_name": institute_name,
        "disclaimer": disclaimer

    };
    res.render("user/gallery.ejs", obj);
});

router.get("/certification", async function (req, res) {
    var data = await exe('SELECT * FROM basic_info');
    var office = await exe('SELECT * FROM office_address');
    var institute_name = await exe(`SELECT * FROM user_footer`);
    var disclaimer = await exe(`SELECT * FROM disclaimer`);
    var certification = await exe(`SELECT * FROM student_certificates`);
    var certification_images = await exe(`SELECT * FROM certification_images`);

    var obj = {
        "company_info": data[0],
        "office": office,
        "institute_name": institute_name,
        "disclaimer": disclaimer,
        "certification_images": certification_images,
        "certification": certification
    };
    res.render("user/certification.ejs", obj);
});

router.post("/verify-certificate", async (req, res) => {
    try {
        var { certificateNumber, mobileNumber } = req.body;

        var result = await exe(`
            SELECT student_certificate 
            FROM student_certificates 
            WHERE student_certificate_number = '${certificateNumber}' 
            AND student_mobile = '${mobileNumber}'
        `);

        if (result.length > 0) {
            res.json({ success: true, image: result[0].student_certificate });
        } else {
            res.json({ success: false });
        }

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

router.get("/workshop", async function (req, res) {
    var data = await exe('SELECT * FROM basic_info');
    var workshop = await exe(`SELECT * FROM workshop`);
    var office = await exe('SELECT * FROM office_address');
    var institute_name = await exe(`SELECT * FROM user_footer`);
    var disclaimer = await exe(`SELECT * FROM disclaimer`);

    var obj = {
        "company_info": data[0],
        "workshop": workshop,
        "office": office,
        "institute_name": institute_name,
        "disclaimer": disclaimer

    };
    res.render("user/workshop.ejs", obj);
});

router.get("/workshop_registration/:id", async function (req, res) {

    var data = await exe('SELECT * FROM basic_info');
    var office = await exe('SELECT * FROM office_address');
    var institute_name = await exe(`SELECT * FROM user_footer`);
    var disclaimer = await exe(`SELECT * FROM disclaimer`);
    var workshop = await exe(`SELECT * FROM workshop WHERE workshop_id = '${req.params.id}'`);


    var obj = {
        "company_info": data[0],
        "office": office,
        "institute_name": institute_name,
        "disclaimer": disclaimer,
        "workshop": workshop,
    }
    res.render("user/workshop_registration.ejs", obj);
});

router.post("/save_registration_for_workshop", async function (req, res) {
    res.send(req.body);
});

router.post("/save_workshop_details", async function (req, res) {
    try {
        const d = req.body;

        const sql = `INSERT INTO customer_workshop (
            customer_name,
            customer_email,
            customer_mobile,
            customer_workshop,
            customer_message
        ) VALUES (?, ?, ?, ?, ?)`;

        const values = [
            d.customer_name,
            d.customer_email,
            d.customer_mobile,
            d.customer_workshop,
            d.customer_message
        ];

        const data = await exe(sql, values); // ✅ Safe parameterized execution

        res.json({ message: "Registration successful!" });

    } catch (err) {
        console.error("Workshop Insert Error:", err);
        res.status(500).json({ message: "Something went wrong!" });
    }
});



router.get("/reviews", async function (req, res) {
    var data = await exe('SELECT * FROM basic_info');
    var reviews = await exe('SELECT * FROM customer_reviews');
    var office = await exe('SELECT * FROM office_address');
    var institute_name = await exe(`SELECT * FROM user_footer`);
    var disclaimer = await exe(`SELECT * FROM disclaimer`);

    var obj = {
        "company_info": data[0],
        "reviews": reviews,
        "office": office,
        "institute_name": institute_name,
        "disclaimer": disclaimer

    };
    res.render("user/reviews.ejs", obj);
});


router.get("/contact", async function (req, res) {
    var data = await exe('SELECT * FROM basic_info');
    var reviews = await exe('SELECT * FROM customer_reviews');
    var office = await exe('SELECT * FROM office_address');
    var institute_name = await exe(`SELECT * FROM user_footer`);
    var disclaimer = await exe(`SELECT * FROM disclaimer`);

    var obj = {
        "company_info": data[0],
        "office": office,
        "institute_name": institute_name,
        "disclaimer": disclaimer
    };
    res.render("user/contact.ejs", obj);
});

const axios = require("axios");

router.post("/save_contact", async function (req, res) {
    try {
        var d = req.body;

        // 🟢 Step 1: captcha token मिळवा
        const token = req.body["g-recaptcha-response"];
        if (!token) {
            return res.send("<script>alert('Please verify you are human.'); window.location='/contact';</script>");
        }

        // 🟢 Step 2: Google verify API call
        const verifyURL = "https://www.google.com/recaptcha/api/siteverify";

        const { data } = await axios.post(verifyURL, null, {
            params: {
                secret: "6LdVsK4rAAAAAH-dOrAJi4bn67iLsPf9K-saz6XW", // तुमचा secret key
                response: token,
                remoteip: req.ip, // optional
            },
        });

        // 🟢 Step 3: check response
        if (!data.success) {
            console.log("CAPTCHA failed:", data["error-codes"]);
            return res.send("<script>alert('Captcha verification failed. Please try again.'); window.location='/contact';</script>");
        }

        // 🟢 Step 4: जर CAPTCHA success असेल तर DB मध्ये insert करा
        var sql = `INSERT INTO user_contact(user_name,user_mobile,user_email,user_message) 
               VALUES ('${d.user_name}','${d.user_mobile}','${d.user_email}','${d.user_message}')`;

        var result = await exe(sql);

        console.log("Contact saved:", result);

        // ✅ Success झाल्यावर redirect करा success page वर
        res.redirect("/success");

    } catch (err) {
        console.error("Error:", err.message);
        return res.send("<script>alert('Server error occurred. Please try again later.'); window.location='/contact';</script>");
    }
});

router.post("/save_review", async function (req, res) {
    var d = req.body;
    var sql = `INSERT INTO customer_reviews(customer_name,customer_email,customer_company_name,customer_position,customer_rating,customer_review) VALUES ('${d.customer_name}','${d.customer_email}','${d.customer_company_name}','${d.customer_position}','${d.customer_rating}','${d.customer_review}')`;
    var data = await exe(sql);
    res.redirect("/reviews");
});

router.get("/course_details/:slug", async function (req, res) {
    try {
        // Basic info
        var data = await exe('SELECT * FROM basic_info');
        var office = await exe('SELECT * FROM office_address');
        var institute_name = await exe('SELECT * FROM user_footer');
        var disclaimer = await exe('SELECT * FROM disclaimer');

        // slug URL मधून घ्या
        const slug = req.params.slug;

        // DB मधून specific course fetch using slug
        var courses = await exe(`SELECT * FROM courses WHERE slug = ?`, [slug]);

        if (courses.length === 0) {
            return res.status(404).send("Course not found");
        }

        // सर्व courses (list)
        var course_info = await exe(`SELECT * FROM courses`);

        var obj = {
            "company_info": data[0],
            "office": office,
            "institute_name": institute_name,
            "disclaimer": disclaimer,
            "courses": courses,
            "course_info": course_info
        }

        res.render("user/course_details.ejs", obj);

    } catch (err) {
        console.error("Error loading course details:", err);
        res.status(500).send("Internal Server Error");
    }
});


router.get("/internship_application", async function (req, res) {

    var data = await exe('SELECT * FROM basic_info');
    var office = await exe('SELECT * FROM office_address');
    var institute_name = await exe(`SELECT * FROM user_footer`);
    var disclaimer = await exe(`SELECT * FROM disclaimer`);

    var obj = {
        "company_info": data[0],
        "office": office,
        "institute_name": institute_name,
        "disclaimer": disclaimer,
    }

    res.render("user/apply_for_internship.ejs", obj);
});

router.post("/save_registration_for_course", async function (req, res) {
    var d = req.body;

    var sql = `INSERT INTO registrations_for_course(student_name,student_email,student_mobile,selected_course,course_mode,student_message) VALUES ('${d.student_name}','${d.student_email}','${d.student_mobile}','${d.selected_course}','${d.course_mode}','${d.student_message}')`;

    var data = await exe(sql);

    res.redirect("/success");
});

// 🌟 OTP CREDENTIAL KEY
const dv_key = "3tPXYZSu6s"; 

// 1. Existing form rendering route
router.get("/internship_form", async function (req, res) {
    res.render("user/internship_form.ejs");
});

// 2. 🌟 UPDATED ROUTE: Generate and save OTP to the Database, then trigger SMS API
router.post("/send-otp", async function (req, res) {
    try {
        const num = req.body.mobile;
        
        if (!num || num.length !== 10) {
            return res.status(400).json({ success: false, message: "Invalid mobile number" });
        }

        // Generate a random 6-digit number
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // 🌟 DATABASE STEP: Insert the OTP record into your internship_mobile_otp table
        // We set is_verified to 0 (false) initially
        const sqlInsert = `INSERT INTO internship_mobile_otp (mobile, otp, is_verified) VALUES (?, ?, '0')`;
        await exe(sqlInsert, [num, otp]);

        // Your specific OTP API gateway URL
        const otp_url = `https://otp.webshost.in/api-sms-v3.php?api_key=${dv_key}&number=${num}&otp=${otp}`;

        // Make an HTTP Request to the SMS API using standard fetch
        const apiResponse = await fetch(otp_url);
        
        if (apiResponse.ok) {
            return res.json({ success: true });
        } else {
            console.error("SMS Gateway responded with error status:", apiResponse.status);
            return res.json({ success: false, message: "Gateway failed to deliver SMS" });
        }
    } catch (err) {
        console.error("SMS Sending/Database Error:", err);
        return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

router.post("/verify-otp", async function (req, res) {
    try {
        const { mobile, otp } = req.body;

        // 🌟 FIX: We check for is_verified = 0 OR is_verified = '0' to avoid strict type mismatch bugs
        const sqlCheck = `SELECT * FROM internship_mobile_otp 
                          WHERE mobile = ? AND otp = ? AND (is_verified = '0' OR is_verified = 0) 
                          ORDER BY created_at DESC LIMIT 1`;
        
        const records = await exe(sqlCheck, [mobile, otp]);

        if (records.length > 0) {
            const targetOtpId = records[0].otp_id;

            // 🌟 FIX: Update status to 1 as a number/string fallback to mark it used cleanly
            const sqlUpdate = `UPDATE internship_mobile_otp SET is_verified = 1 WHERE otp_id = ?`;
            await exe(sqlUpdate, [targetOtpId]);

            return res.json({ success: true });
        } else {
            return res.json({ success: false, message: "Incorrect or expired OTP validation token" });
        }
    } catch (err) {
        console.error("Database validation pipeline error:", err);
        return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

// 4. Existing route: Saves submission data safely after verification
router.post("/save_internships", async function (req, res) {
    try {
        var d = req.body;

        // Convert multi-select checkboxes/options array into a safe comma-separated string
        let selected_internships = d.student_selected_internships;
        if (Array.isArray(selected_internships)) {
            selected_internships = selected_internships.join(", ");
        } else if (!selected_internships) {
            selected_internships = ""; 
        }

        var sql = `INSERT INTO internships_registrations
            (student_name, student_mobile, student_email, student_college_name, student_degree, student_academic_year, student_selected_internships) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`;

        var values = [
            d.student_name,
            d.student_mobile,
            d.student_email,
            d.student_college_name,
            d.student_degree,
            d.student_academic_year,
            selected_internships
        ];

        await exe(sql, values);

        res.redirect("/success");
    } catch (err) {
        console.error("Error while saving internship:", err);
        res.status(500).send("Database Error");
    }
});


router.get("/success", async function (req, res) {
    res.render("user/success.ejs");
});

router.get("/guest-lecture-reg", async function (req, res) {
    var data = await exe('SELECT * FROM basic_info');
    var office = await exe('SELECT * FROM office_address');
    var institute_name = await exe(`SELECT * FROM user_footer`);
    var disclaimer = await exe(`SELECT * FROM disclaimer`);

    var obj = {
        "company_info": data[0],
        "office": office,
        "institute_name": institute_name,
        "disclaimer": disclaimer,
    }
    res.render("user/guest-lecture-reg.ejs", obj);
});

router.get("/adsul-guest-lecture-reg", async function (req, res) {
    var data = await exe('SELECT * FROM basic_info');
    var office = await exe('SELECT * FROM office_address');
    var institute_name = await exe(`SELECT * FROM user_footer`);
    var disclaimer = await exe(`SELECT * FROM disclaimer`);

    var obj = {
        "company_info": data[0],
        "office": office,
        "institute_name": institute_name,
        "disclaimer": disclaimer,
    }
    res.render("user/adsul-guest-lecture-reg.ejs", obj);
});

router.post("/save-adsul-guest-lecture-reg", async function (req, res) {
    var d = req.body;

    var sql = `INSERT INTO adsul_guest_lecture_reg (first_name, last_name, email_id, mobile, career, internship, guest_lecture, job_alerts) VALUES ('${d.first_name}','${d.last_name}','${d.email_id}','${d.mobile}','${d.career}','${d.internship}','${d.guest_lecture}','${d.job_alerts}')`;

    var data = await exe(sql);

    res.redirect("/success");
});

router.get("/adsul-ind-visit-reg", async function (req, res) {
    var data = await exe('SELECT * FROM basic_info');
    var office = await exe('SELECT * FROM office_address');
    var institute_name = await exe(`SELECT * FROM user_footer`);
    var disclaimer = await exe(`SELECT * FROM disclaimer`);

    var obj = {
        "company_info": data[0],
        "office": office,
        "institute_name": institute_name,
        "disclaimer": disclaimer,
    }
    res.render("user/adsul-ind-visit.ejs", obj);
});

router.post("/save-adsul-ind-visit-reg", async function (req, res) {
    var d = req.body;

    var sql = `INSERT INTO adsul_ind_visit_reg (first_name, last_name, email_id, mobile, career, internship, guest_lecture, job_alerts) VALUES ('${d.first_name}','${d.last_name}','${d.email_id}','${d.mobile}','${d.career}','${d.internship}','${d.guest_lecture}','${d.job_alerts}')`;

    var data = await exe(sql);

    res.redirect("/success");
});

router.post("/save-samarth-college-guest-lecture-reg", async function (req, res) {
    var d = req.body;

    var sql = `INSERT INTO samarth_college_guest_lecture_reg (first_name, last_name, email_id, mobile, career, internship, guest_lecture, job_alerts) VALUES ('${d.first_name}','${d.last_name}','${d.email_id}','${d.mobile}','${d.career}','${d.internship}','${d.guest_lecture}','${d.job_alerts}')`;

    var data = await exe(sql);

    res.redirect("/success");
});

router.get("/samarth-college-guest-lecture-reg", async function (req, res) {
    var data = await exe('SELECT * FROM basic_info');
    var office = await exe('SELECT * FROM office_address');
    var institute_name = await exe(`SELECT * FROM user_footer`);
    var disclaimer = await exe(`SELECT * FROM disclaimer`);

    var obj = {
        "company_info": data[0],
        "office": office,
        "institute_name": institute_name,
        "disclaimer": disclaimer,
    }
    res.render("user/samarth-college-guest-lecture.ejs", obj);
});

router.get("/vishwabharati-college-guest-lecture-reg", async function (req, res) {
    var data = await exe('SELECT * FROM basic_info');
    var office = await exe('SELECT * FROM office_address');
    var institute_name = await exe(`SELECT * FROM user_footer`);
    var disclaimer = await exe(`SELECT * FROM disclaimer`);

    var obj = {
        "company_info": data[0],
        "office": office,
        "institute_name": institute_name,
        "disclaimer": disclaimer,
    }
    res.render("user/vishwabharati-college-guest-lecture.ejs", obj);
});

router.post("/save-vishwabharati-college-guest-lecture-reg", async function (req, res) {
    var d = req.body;

    var sql = `INSERT INTO vishwabharati_college_guest_lecture_reg (first_name, last_name, email_id, mobile, career, internship, guest_lecture, job_alerts) VALUES ('${d.first_name}','${d.last_name}','${d.email_id}','${d.mobile}','${d.career}','${d.internship}','${d.guest_lecture}','${d.job_alerts}')`;

    var data = await exe(sql);

    res.redirect("/success");
});

router.post("/save_industrial_visit", async function (req, res) {
    var d = req.body;

    var sql = `INSERT INTO ind_visit_reg (first_name, last_name, email_id, mobile, career, internship, guest_lecture, job_alerts) VALUES ('${d.first_name}','${d.last_name}','${d.email_id}','${d.mobile}','${d.career}','${d.internship}','${d.guest_lecture}','${d.job_alerts}')`;

    var data = await exe(sql);

    res.redirect("/success");
});

router.get("/ind-visit", async function (req, res) {
    var data = await exe('SELECT * FROM basic_info');
    var office = await exe('SELECT * FROM office_address');
    var institute_name = await exe(`SELECT * FROM user_footer`);
    var disclaimer = await exe(`SELECT * FROM disclaimer`);

    var obj = {
        "company_info": data[0],
        "office": office,
        "institute_name": institute_name,
        "disclaimer": disclaimer,
    }
    res.render("user/ind-visit.ejs", obj);
});

router.get("/career", async function (req, res) {
    var data = await exe('SELECT * FROM basic_info');
    var office = await exe('SELECT * FROM office_address');
    var institute_name = await exe(`SELECT * FROM user_footer`);
    var disclaimer = await exe(`SELECT * FROM disclaimer`);

    var obj = {
        "company_info": data[0],
        "office": office,
        "institute_name": institute_name,
        "disclaimer": disclaimer,
    }
    res.render("user/carreer.ejs", obj);
});

router.post("/save_job_applications", async function (req, res) {
    if (req.files) {
        var resume = new Date().getTime() + req.files.resume.name;
        req.files.resume.mv("public/uploads/" + resume);

        var d = req.body;

        var sql = `INSERT INTO job_applications(name,mobile,email,job_roles,experience,resume) VALUES ('${d.name}','${d.mobile}','${d.email}','${d.job_roles}','${d.experience}','${resume}')`;

        var data = await exe(sql);
    }

    res.redirect("/success");
});

router.get("/search_jobs", async function (req, res) {
    var data = await exe('SELECT * FROM basic_info');
    var office = await exe('SELECT * FROM office_address');
    var institute_name = await exe(`SELECT * FROM user_footer`);
    var disclaimer = await exe(`SELECT * FROM disclaimer`);

    var obj = {
        "company_info": data[0],
        "office": office,
        "institute_name": institute_name,
        "disclaimer": disclaimer,
    }
    res.render("user/search_jobs.ejs", obj);
});

router.post("/save_information", async function (req, res) {
    if (req.files) {
        // Save the uploaded resume file with a timestamp prefix
        var resume = new Date().getTime() + req.files.resume.name;
        req.files.resume.mv("public/uploads/" + resume);

        var d = req.body;

        var sql = `INSERT INTO job_search_candidates(
        full_name,
        mobile_number,
        email,
        date_of_birth,
        nationality,
        marital_status,
        address,
        pin_code,
        twelfth_board,
        school_name,
        twelfth_passing_year,
        twelfth_marks,
        graduation_degree,
        graduation_university,
        graduation_passing_year,
        graduation_marks,
        masters_degree,
        masters_university,
        masters_passing_year,
        masters_marks,
        certification_name,
        certification_institute,
        job_title,
        company_name,
        years_of_experience,
        job_description,
        expected_salary,
        resume
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

        var params = [
            d.full_name,
            d.mobile_number,
            d.email,
            d.date_of_birth,
            d.nationality,
            d.marital_status,
            d.address,
            d.pin_code,
            d.twelfth_board,
            d.school_name,
            d.twelfth_passing_year,
            d.twelfth_marks,
            d.graduation_degree,
            d.graduation_university,
            d.graduation_passing_year,
            d.graduation_marks,
            d.masters_degree,
            d.masters_university,
            d.masters_passing_year,
            d.masters_marks,
            d.certification_name,
            d.certification_institute,
            d.job_title,
            d.company_name,
            d.years_of_experience,
            d.job_description,
            d.expected_salary,
            resume
        ];

        var data = await exe(sql, params);
    }
    res.redirect("/confirm_payment");
});

router.get("/confirm_payment", async function (req, res) {
    res.render("user/confirm_payment.ejs");
});

router.get("/terms_conditions", async function (req, res) {
    var data = await exe('SELECT * FROM basic_info');
    var office = await exe('SELECT * FROM office_address');
    var institute_name = await exe(`SELECT * FROM user_footer`);
    var disclaimer = await exe(`SELECT * FROM disclaimer`);

    var obj = {
        "company_info": data[0],
        "office": office,
        "institute_name": institute_name,
        "disclaimer": disclaimer,
    }
    res.render("user/terms&conditions.ejs", obj);
});

router.get("/industrial_training", async function (req, res) {
    var data = await exe('SELECT * FROM basic_info');
    var office = await exe('SELECT * FROM office_address');
    var institute_name = await exe(`SELECT * FROM user_footer`);
    var disclaimer = await exe(`SELECT * FROM disclaimer`);

    var obj = {
        "company_info": data[0],
        "office": office,
        "institute_name": institute_name,
        "disclaimer": disclaimer,
    }
    res.render("user/industrial_training.ejs", obj);
});

router.get("/training_payment", async function (req, res) {
    var data = await exe('SELECT * FROM basic_info');
    var office = await exe('SELECT * FROM office_address');
    var institute_name = await exe(`SELECT * FROM user_footer`);
    var disclaimer = await exe(`SELECT * FROM disclaimer`);

    var obj = {
        "company_info": data[0],
        "office": office,
        "institute_name": institute_name,
        "disclaimer": disclaimer,
    }
    res.render("user/training_payment.ejs", obj);
});

router.post("/save_industrial_training", async function (req, res) {

    var passport_photo = prefix + req.files.passport_photo.name;
    req.files.passport_photo.mv("public/uploads/" + passport_photo);

    var adhar_front = prefix + req.files.adhar_front.name;
    req.files.adhar_front.mv("public/uploads/" + adhar_front);

    var adhar_back = prefix + req.files.adhar_back.name;
    req.files.adhar_back.mv("public/uploads/" + adhar_back);

    var college_ID = prefix + req.files.college_ID.name;
    req.files.college_ID.mv("public/uploads/" + college_ID);

    var d = req.body;

    var sql = `INSERT INTO industrial_training 
            (first_name, last_name, email_id, mobile, passport_photo, adhar_front, adhar_back, college_ID) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    var values = [d.first_name, d.last_name, d.email_id, d.mobile, passport_photo, adhar_front, adhar_back, college_ID];

    var data = await exe(sql, values);

    res.redirect("/training_payment");

});

router.get("/internship-registration", async function (req, res) {
    var data = await exe('SELECT * FROM basic_info');
    var office = await exe('SELECT * FROM office_address');
    var institute_name = await exe(`SELECT * FROM user_footer`);
    var disclaimer = await exe(`SELECT * FROM disclaimer`);

    var obj = {
        "company_info": data[0],
        "office": office,
        "institute_name": institute_name,
        "disclaimer": disclaimer,
    }
    res.render("user/college-internship-form.ejs", obj);
});

router.post("/save_college_internships_registration", async function (req, res) {
    try {
        var d = req.body;

        var sql = `INSERT INTO college_internships_registration
            (student_name, student_mobile, student_email, student_college_name, student_degree, student_academic_year, student_selected_internships) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`;

        var values = [
            d.student_name,
            d.student_mobile,
            d.student_email,
            d.student_college_name,
            d.student_degree,
            d.student_academic_year,
            d.student_selected_internships
        ];

        await exe(sql, values); // assuming exe supports params

        res.redirect("/success");
    } catch (err) {
        console.error("Error while saving internship:", err);
        res.status(500).send("Database Error");
    }
});

router.get("/get-certificate", async function (req, res) {
    var data = await exe('SELECT * FROM basic_info');
    var office = await exe('SELECT * FROM office_address');
    var institute_name = await exe(`SELECT * FROM user_footer`);
    var disclaimer = await exe(`SELECT * FROM disclaimer`);

    var obj = {
        "company_info": data[0],
        "office": office,
        "institute_name": institute_name,
        "disclaimer": disclaimer,
    }
    res.render("user/get-certificate.ejs", obj);
});

router.get("/register-for-workshop", async function (req, res) {
    var data = await exe('SELECT * FROM basic_info');
    var office = await exe('SELECT * FROM office_address');
    var institute_name = await exe(`SELECT * FROM user_footer`);
    var disclaimer = await exe(`SELECT * FROM disclaimer`);

    var obj = {
        "company_info": data[0],
        "office": office,
        "institute_name": institute_name,
        "disclaimer": disclaimer,
    }
    res.render("user/register-for-workshop.ejs", obj);
});

router.get("/registrations", async function (req, res) {
    var data = await exe('SELECT * FROM basic_info');
    var office = await exe('SELECT * FROM office_address');
    var institute_name = await exe(`SELECT * FROM user_footer`);
    var disclaimer = await exe(`SELECT * FROM disclaimer`);

    var obj = {
        "company_info": data[0],
        "office": office,
        "institute_name": institute_name,
        "disclaimer": disclaimer,
    }
    res.render("user/registrations.ejs", obj);
});

// Academic certified internship section


router.get("/ai-agent-developement", async function (req, res) {
    res.render("user/ai-agent-developement.ejs");
});

router.get("/google-academy", async function (req, res) {
    res.render("user/google-academy.ejs");
});

router.get("/microsoft-academy", async function (req, res) {
    res.render("user/microsoft-academy.ejs");
});

router.get("/aws-academy", async function (req, res) {
    res.render("user/aws-academy.ejs");
});

router.get("/oracle-academy", async function (req, res) {
    res.render("user/oracle-academy.ejs");
});

router.get("/meta-academy", async function (req, res) {
    res.render("user/meta-academy.ejs");
});

router.get("/make-payment", async function (req, res) {
    res.render("user/make-payment.ejs");
});

router.post("/make-payment", async function (req, res) {
    try {
        var d = req.body || {};

        // ==== MOBILE NUMBER VALIDATION ====
        const mobile = d.phone_number ? d.phone_number.trim() : "";
        const mobileRegex = /^[6-9]\d{9}$/;

        if (!mobileRegex.test(mobile)) {
            return res.send(`
                <html>
                <head>
                    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
                </head>
                <body>
                    <script>
                        Swal.fire({
                            icon: 'warning',
                            title: 'Invalid Number',
                            text: 'Please enter a valid 10-digit mobile number!',
                        }).then(() => {
                            window.history.back();
                        });
                    </script>
                </body>
                </html>
            `);
        }

        // ==== CHECK IF NUMBER ALREADY REGISTERED ====
        const checkSql = "SELECT id FROM registrations WHERE phone_number = ? LIMIT 1";
        const existing = await exe(checkSql, [mobile]);

        if (existing.length > 0) {
            return res.send(`
                <html>
                <head>
                    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
                </head>
                <body>
                    <script>
                        Swal.fire({
                            icon: 'error',
                            title: 'Already Registered',
                            text: 'This mobile number is already registered!',
                        }).then(() => {
                            window.history.back();
                        });
                    </script>
                </body>
                </html>
            `);
        }

        // ====== PROCESS CERTIFICATIONS ======
        var certs = d.certifications || d['certifications[]'] || [];

        if (typeof certs === 'string') certs = [certs];
        else if (!Array.isArray(certs)) certs = [];

        var allowed = [
            'AI Agent Development',
            'Google Academy',
            'Microsoft Academy',
            'AWS Academy',
            'Oracle Academy',
            'Meta Academy'
        ];

        certs = certs.filter(c => allowed.includes(c)).slice(0, 3);

        var cert_1 = certs[0] || null;
        var cert_2 = certs[1] || null;
        var cert_3 = certs[2] || null;

        // ====== INSERT DATA ======
        var sql = `
            INSERT INTO registrations
            (student_name, phone_number, learning_mode, cert_1, cert_2, cert_3, created_at)
            VALUES (?, ?, ?, ?, ?, ?, NOW())
        `;

        var values = [
            d.student_name || null,
            mobile,
            d["learning-mode"] || null,
            cert_1,
            cert_2,
            cert_3
        ];

        await exe(sql, values);

        res.redirect("/make-payment");

    } catch (err) {
        console.error("Error while saving registration:", err);
        res.status(500).send("Database Error");
    }
});

router.get("/student-feedback", async function (req, res) {
    var data = await exe('SELECT * FROM basic_info');
    var office = await exe('SELECT * FROM office_address');
    var institute_name = await exe(`SELECT * FROM user_footer`);
    var disclaimer = await exe(`SELECT * FROM disclaimer`);

    var obj = {
        "company_info": data[0],
        "office": office,
        "institute_name": institute_name,
        "disclaimer": disclaimer,
    }
    res.render("user/feedback-form.ejs", obj);
});

router.post("/save-feedback", async function (req, res) {
    try {
        var d = req.body || {};

        // Normalize mobile (keep only digits)
        var mobileRaw = (d.mobile || "").toString().trim();
        var mobile = mobileRaw.replace(/\D/g, "");

        // If mobile was provided but not valid 10 digits -> show SweetAlert and stop
        if (mobileRaw && mobile.length !== 10) {
            res.setHeader("Content-Type", "text/html; charset=utf-8");
            return res.send(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Invalid Mobile</title>
</head>
<body>
  <script>
    (function(){
      function show(msgTitle, msgText){
        // Try to load SweetAlert if not present
        var runAlert = function(){
          if (window.Swal && typeof window.Swal.fire === 'function') {
            window.Swal.fire({ icon: 'warning', title: msgTitle, text: msgText })
              .then(() => { window.history.back(); });
          } else {
            alert(msgTitle + "\\n\\n" + msgText);
            window.history.back();
          }
        };

        // If Swal not loaded, dynamically load from CDN then run
        if (!window.Swal) {
          var s = document.createElement('script');
          s.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11';
          s.onload = runAlert;
          s.onerror = runAlert;
          document.head.appendChild(s);
        } else runAlert();
      }

      show('Invalid Mobile', 'Please enter a valid 10-digit mobile number.');
    })();
  </script>
</body>
</html>`);
        }

        // If mobile provided -> check duplicate
        if (mobile) {
            var checkSql = "SELECT id FROM feedbacks WHERE mobile = ? LIMIT 1";
            var checkResult = await exe(checkSql, [mobile]);

            if (checkResult && checkResult.length > 0) {
                res.setHeader("Content-Type", "text/html; charset=utf-8");
                return res.send(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Already Submitted</title>
</head>
<body>
  <script>
    (function(){
      function show(msgTitle, msgText){
        var runAlert = function(){
          if (window.Swal && typeof window.Swal.fire === 'function') {
            window.Swal.fire({ icon: 'warning', title: msgTitle, text: msgText })
              .then(() => { window.history.back(); });
          } else {
            alert(msgTitle + "\\n\\n" + msgText);
            window.history.back();
          }
        };
        if (!window.Swal) {
          var s = document.createElement('script');
          s.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11';
          s.onload = runAlert;
          s.onerror = runAlert;
          document.head.appendChild(s);
        } else runAlert();
      }

      show('Already Submitted!', 'This mobile number has already submitted feedback!');
    })();
  </script>
</body>
</html>`);
            }
        }

        // Proceed to insert (use normalized mobile or null)
        var sql = `INSERT INTO feedbacks 
      (name, mobile, overall_rating, instructor_rating, handson_rating, combined_rating, suggestions, internship_interest, recommend)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        var values = [
            (d.name || "").toString().trim(),
            mobile || null,
            d.overall || 3,
            d.instructor || 3,
            d.handson || 3,
            d.combined || 3,
            (d.suggestions || "").toString().trim(),
            (d.internship || null),
            (d.recommend || null)
        ];

        await exe(sql, values);

        // On success -> SweetAlert then redirect to /success
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        return res.send(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Thank you</title>
</head>
<body>
  <script>
    (function(){
      function showAndRedirect(){
        var run = function(){
          if (window.Swal && typeof window.Swal.fire === 'function') {
            window.Swal.fire({
              icon: 'success',
              title: 'Thank you - Feedback submitted successfully!',
              text: 'You will be redirected to the Advanced Internship Program registration page.',
              timer: 4000,
              showConfirmButton: false
            }).then(function(){ window.location.href = '/ai-agent-developement'; });
          } else {
            alert('Feedback submitted successfully!');
            window.location.href = '/ai-agent-developement';
          }
        };
        if (!window.Swal) {
          var s = document.createElement('script');
          s.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11';
          s.onload = run;
          s.onerror = run;
          document.head.appendChild(s);
        } else run();
      }
      showAndRedirect();
    })();
  </script>
</body>
</html>`);
    } catch (err) {
        console.error("Error while saving feedback:", err);
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        return res.send(`<!doctype html>
<html lang="en">
<head><meta charset="utf-8" /><title>Error</title></head>
<body>
  <script>
    (function(){
      var run = function(){
        if (window.Swal && typeof window.Swal.fire === 'function') {
          window.Swal.fire({ icon: 'error', title: 'Error!', text: 'Database Error. Please try again later.' })
            .then(() => window.history.back());
        } else {
          alert('Database Error. Please try again later.');
          window.history.back();
        }
      };
      if (!window.Swal) {
        var s = document.createElement('script');
        s.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11';
        s.onload = run;
        s.onerror = run;
        document.head.appendChild(s);
      } else run();
    })();
  </script>
</body>
</html>`);
    }
});

router.get("/advanced-internship-registration", async function (req, res) {
    var data = await exe('SELECT * FROM basic_info');
    var office = await exe('SELECT * FROM office_address');
    var institute_name = await exe(`SELECT * FROM user_footer`);
    var disclaimer = await exe(`SELECT * FROM disclaimer`);

    var obj = {
        "company_info": data[0],
        "office": office,
        "institute_name": institute_name,
        "disclaimer": disclaimer

    };
    res.render("user/advanced-internship-registration.ejs", obj);
});

router.post('/save_internships_registrations', async (req, res) => {
    try {
        const {
            student_name,
            student_mobile,
            student_email,
            internship_type,
            college_name,
            hod_name,
            hod_contact,
            student_selected_internship,
            internship_duration,
            internship_start_date,
            internship_mode
        } = req.body;

        // Basic validation
        if (
            !student_name ||
            !student_mobile ||
            !student_email ||
            !internship_type ||
            !student_selected_internship ||
            !internship_duration ||
            !internship_start_date ||
            !internship_mode
        ) {
            return res.status(400).send('All fields are required');
        }

        // 🔥 If Academic → academic fields required
        if (internship_type === "Academic") {
            if (!college_name || !hod_name || !hod_contact) {
                return res.status(400).send('Academic details are required');
            }
        }


        const insertQuery = `
            INSERT INTO advanced_internship_registrations
            (
                student_name,
                student_mobile,
                student_email,
                internship_type,
                college_name,
                hod_name,
                hod_contact,
                internship_domain,
                internship_duration,
                internship_start_date,
                internship_mode
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            student_name,
            student_mobile,
            student_email,
            internship_type,
            internship_type === "Academic" ? college_name : "",
            internship_type === "Academic" ? hod_name : "",
            internship_type === "Academic" ? hod_contact : "",
            student_selected_internship,
            internship_duration,
            internship_start_date,
            internship_mode
        ];



        const result = await exe(insertQuery, values);

        // success
        res.redirect('/success');
        // OR: res.json({ success: true, insertId: result.insertId });

    } catch (error) {
        console.error('Insert Error:', error);
        res.status(500).send('Something went wrong');
    }
});

router.get("/resume_session_registration", async function (req, res) {
    var data = await exe('SELECT * FROM basic_info');
    var workshop = await exe(`SELECT * FROM workshop`);
    var office = await exe('SELECT * FROM office_address');
    var institute_name = await exe(`SELECT * FROM user_footer`);
    var disclaimer = await exe(`SELECT * FROM disclaimer`);

    var obj = {
        "company_info": data[0],
        "workshop": workshop,
        "office": office,
        "institute_name": institute_name,
        "disclaimer": disclaimer

    };
    res.render("user/resume_session_registration.ejs", obj);
});

router.post("/save_resume_session_registration", async function (req, res) {

    let d = req.body;

    await exe(`
        INSERT INTO resume_session_registrations 
        (full_name, mobile_number, college_name, course_degree, current_status, have_resume, have_linkedin, mode_of_attendance)
        VALUES 
        (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
        d.full_name,
        d.mobile_number,
        d.college_name,
        d.course_degree,
        d.current_status,
        d.have_resume,
        d.have_linkedin,
        d.mode_of_attendance
    ]);

    res.redirect("/success");
});

router.get("/essentials-of-cloud-computing-reg", async function (req, res) {
    var data = await exe('SELECT * FROM basic_info');
    var workshop = await exe(`SELECT * FROM workshop`);
    var office = await exe('SELECT * FROM office_address');
    var institute_name = await exe(`SELECT * FROM user_footer`);
    var disclaimer = await exe(`SELECT * FROM disclaimer`);

    var obj = {
        "company_info": data[0],
        "workshop": workshop,
        "office": office,
        "institute_name": institute_name,
        "disclaimer": disclaimer

    };
    res.render("user/karjat-college-cloud-reg.ejs", obj);
});

router.post("/save-karjat-dp-cloud-reg", async function (req, res) {
    var d = req.body;

    var sql = `INSERT INTO karjat_dp_cloud_reg 
    (full_name, mobile, course_name, course_year, career, internship, guest_lecture, job_alerts) 
    VALUES 
    ('${d.full_name}','${d.mobile}','${d.course_name}','${d.course_year}','${d.career}','${d.internship}','${d.guest_lecture}','${d.job_alerts}')`;

    var data = await exe(sql);

    res.redirect("/success");
});

router.get("/adsul-interview-drive", async function (req, res) {
    var data = await exe('SELECT * FROM basic_info');
    var workshop = await exe(`SELECT * FROM workshop`);
    var office = await exe('SELECT * FROM office_address');
    var institute_name = await exe(`SELECT * FROM user_footer`);
    var disclaimer = await exe(`SELECT * FROM disclaimer`);

    var obj = {
        "company_info": data[0],
        "workshop": workshop,
        "office": office,
        "institute_name": institute_name,
        "disclaimer": disclaimer

    };
    res.render("user/adsul-interview-drive.ejs", obj);
});

router.post("/save-adsul-interview-drive-reg", async function (req, res) {
    var d = req.body;

    var sql = `INSERT INTO adsul_interview_drive_reg
    (full_name, mobile, course_name, course_year, career, internship, guest_lecture, job_alerts) 
    VALUES 
    ('${d.full_name}','${d.mobile}','${d.course_name}','${d.course_year}','${d.career}','${d.internship}','${d.guest_lecture}','${d.job_alerts}')`;

    var data = await exe(sql);

    res.redirect("/success");
});

router.get("/itr-registration", async function (req, res) {
    var data = await exe('SELECT * FROM basic_info');
    var workshop = await exe(`SELECT * FROM workshop`);
    var office = await exe('SELECT * FROM office_address');
    var institute_name = await exe(`SELECT * FROM user_footer`);
    var disclaimer = await exe(`SELECT * FROM disclaimer`);

    var obj = {
        "company_info": data[0],
        "workshop": workshop,
        "office": office,
        "institute_name": institute_name,
        "disclaimer": disclaimer

    };
    res.render("user/itr-registration.ejs", obj);
});

router.post("/save_training_registrations", async function (req, res) {

    var d = req.body;

    var sql = `INSERT INTO training_registrations
    (student_name, student_mobile, student_email, training_domain, training_mode) 
    VALUES 
    ('${d.student_name}','${d.student_mobile}','${d.student_email}','${d.training_domain}','${d.training_mode}')`;

    var data = await exe(sql);

    res.redirect("/success");
});

router.get("/adsul_internship_reg", async function (req, res) {
    var data = await exe('SELECT * FROM basic_info');
    var workshop = await exe(`SELECT * FROM workshop`);
    var office = await exe('SELECT * FROM office_address');
    var institute_name = await exe(`SELECT * FROM user_footer`);
    var disclaimer = await exe(`SELECT * FROM disclaimer`);

    var obj = {
        "company_info": data[0],
        "workshop": workshop,
        "office": office,
        "institute_name": institute_name,
        "disclaimer": disclaimer

    };
    res.render("user/adsul_internship_reg.ejs", obj);
});

router.post("/save_adsul_internship_registrations", async function (req, res) {

    var d = req.body;

    var sql = `INSERT INTO adsul_internship_registrations
    (student_name, student_mobile, student_email, internship_domain, internship_mode) 
    VALUES (?, ?, ?, ?, ?)`;

    var data = await exe(sql, [
        d.student_name,
        d.student_mobile,
        d.student_email,
        d.internship_domain,
        d.internship_mode
    ]);

    res.redirect("/success");
});

router.get("/scsmcoe_internship_reg", async function (req, res) {
    var data = await exe('SELECT * FROM basic_info');
    var workshop = await exe(`SELECT * FROM workshop`);
    var office = await exe('SELECT * FROM office_address');
    var institute_name = await exe(`SELECT * FROM user_footer`);
    var disclaimer = await exe(`SELECT * FROM disclaimer`);

    var obj = {
        "company_info": data[0],
        "workshop": workshop,
        "office": office,
        "institute_name": institute_name,
        "disclaimer": disclaimer

    };
    res.render("user/scsmcoe.ejs", obj);
});

router.post("/save_scsmcoe_internship_reg", async function (req, res) {

    var d = req.body;

    var sql = `INSERT INTO scsmcoe_internship_reg
    (student_name, student_mobile, student_email, internship_domain, internship_mode) 
    VALUES (?, ?, ?, ?, ?)`;

    var data = await exe(sql, [
        d.student_name,
        d.student_mobile,
        d.student_email,
        d.internship_domain,
        d.internship_mode
    ]);

    res.redirect("/success");
});

router.get("/services", async function(req,res){

    var data = await exe("SELECT * FROM basic_info");
    var office = await exe("SELECT * FROM office_address");
    var institute_name = await exe("SELECT * FROM user_footer");
    var disclaimer = await exe("SELECT * FROM disclaimer");

    var services = await exe(
        "SELECT * FROM services WHERE status='Active'"
    );

    var obj = {
        company_info : data[0],
        office : office,
        institute_name : institute_name,
        disclaimer : disclaimer,
        services : services
    };

    res.render("user/services.ejs",obj);

});

router.get("/service/:slug", async function(req,res){

    var slug = req.params.slug;

    var data = await exe("SELECT * FROM basic_info");
    var office = await exe("SELECT * FROM office_address");
    var institute_name = await exe("SELECT * FROM user_footer");
    var disclaimer = await exe("SELECT * FROM disclaimer");

    var service = await exe(
        `SELECT * FROM services
         WHERE service_slug='${slug}'`
    );

    var obj = {

        company_info : data[0],
        office : office,
        institute_name : institute_name,
        disclaimer : disclaimer,
        service : service[0]

    };

    res.render("user/service-details.ejs",obj);

});

router.get("/website-development", async function (req, res) {

    var data = await exe("SELECT * FROM basic_info");
    var office = await exe("SELECT * FROM office_address");
    var institute_name = await exe("SELECT * FROM user_footer");
    var disclaimer = await exe("SELECT * FROM disclaimer");

    var obj = {
        company_info: data[0],
        office: office,
        institute_name: institute_name,
        disclaimer: disclaimer
    };

    res.render("user/website-development.ejs", obj);
});


router.get("/mobile-app-development", async function (req, res) {

    var data = await exe("SELECT * FROM basic_info");
    var office = await exe("SELECT * FROM office_address");
    var institute_name = await exe("SELECT * FROM user_footer");
    var disclaimer = await exe("SELECT * FROM disclaimer");

    var obj = {
        company_info: data[0],
        office: office,
        institute_name: institute_name,
        disclaimer: disclaimer
    };

    res.render("user/mobile-app-development.ejs", obj);
});


router.get("/graphic-designing", async function (req, res) {

    var data = await exe("SELECT * FROM basic_info");
    var office = await exe("SELECT * FROM office_address");
    var institute_name = await exe("SELECT * FROM user_footer");
    var disclaimer = await exe("SELECT * FROM disclaimer");

    var obj = {
        company_info: data[0],
        office: office,
        institute_name: institute_name,
        disclaimer: disclaimer
    };

    res.render("user/graphic-designing.ejs", obj);
});


router.get("/digital-marketing", async function (req, res) {

    var data = await exe("SELECT * FROM basic_info");
    var office = await exe("SELECT * FROM office_address");
    var institute_name = await exe("SELECT * FROM user_footer");
    var disclaimer = await exe("SELECT * FROM disclaimer");

    var obj = {
        company_info: data[0],
        office: office,
        institute_name: institute_name,
        disclaimer: disclaimer
    };

    res.render("user/digital-marketing.ejs", obj);
});


router.get("/software-development", async function (req, res) {

    var data = await exe("SELECT * FROM basic_info");
    var office = await exe("SELECT * FROM office_address");
    var institute_name = await exe("SELECT * FROM user_footer");
    var disclaimer = await exe("SELECT * FROM disclaimer");

    var obj = {
        company_info: data[0],
        office: office,
        institute_name: institute_name,
        disclaimer: disclaimer
    };

    res.render("user/software-development.ejs", obj);
});


router.get("/ai-iot-development", async function (req, res) {

    var data = await exe("SELECT * FROM basic_info");
    var office = await exe("SELECT * FROM office_address");
    var institute_name = await exe("SELECT * FROM user_footer");
    var disclaimer = await exe("SELECT * FROM disclaimer");

    var obj = {
        company_info: data[0],
        office: office,
        institute_name: institute_name,
        disclaimer: disclaimer
    };

    res.render("user/ai-iot-development.ejs", obj);
});


router.get("/data-marketing", async function (req, res) {

    var data = await exe("SELECT * FROM basic_info");
    var office = await exe("SELECT * FROM office_address");
    var institute_name = await exe("SELECT * FROM user_footer");
    var disclaimer = await exe("SELECT * FROM disclaimer");

    var obj = {
        company_info: data[0],
        office: office,
        institute_name: institute_name,
        disclaimer: disclaimer
    };

    res.render("user/data-marketing.ejs", obj);
});


router.get("/website-design", async function (req, res) {

    var data = await exe("SELECT * FROM basic_info");
    var office = await exe("SELECT * FROM office_address");
    var institute_name = await exe("SELECT * FROM user_footer");
    var disclaimer = await exe("SELECT * FROM disclaimer");

    var obj = {
        company_info: data[0],
        office: office,
        institute_name: institute_name,
        disclaimer: disclaimer
    };

    res.render("user/website-design.ejs", obj);
});

router.get("/service/:slug", async function(req,res){

    var slug = req.params.slug;

    console.log(slug);

    var data = await exe('SELECT * FROM basic_info');

    var office = await exe('SELECT * FROM office_address');

    var institute_name = await exe('SELECT * FROM user_footer');

    var disclaimer = await exe('SELECT * FROM disclaimer');

    var service = await exe(
        `SELECT * FROM services WHERE slug='${slug}'`
    );

    if(service.length == 0){

        return res.send("Service Not Found");

    }

    var obj = {

        "company_info":data[0],

        "office":office,

        "institute_name":institute_name,

        "disclaimer":disclaimer,

        "service":service[0]

    };

    res.render("user/service-details.ejs",obj);

});





module.exports = router;