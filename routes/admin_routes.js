const express = require("express");
const exe = require("./../connection");
const router = express.Router();
const prefix = "kanak-digifex-mumbai-mira-road-ahilyanagar-"

const { google } = require("googleapis");
const path = require("path");

// 🔥 Service Account Meet Generator
async function createMeetAutomatically(courseName, date, time) {

    const auth = new google.auth.GoogleAuth({
        keyFile: path.join(__dirname, "../config/service-account.json"),
        scopes: ["https://www.googleapis.com/auth/calendar"],
    });

    const client = await auth.getClient();
    client.subject = "contact@kanakdigifex.com";

    const calendar = google.calendar({
        version: "v3",
        auth: client,
    });

    const startDateTime = new Date(`${date}T${time}:00`);
    const endDateTime = new Date(startDateTime.getTime() + 60 * 60000);

    const event = {
        summary: `Kanak Digifex | ${courseName}  `,

        description: `
        🎓 Course: ${courseName}
        📅 Date: ${date}
        ⏰ Time: ${time}
        
        🏢 Conducted by: Kanak Digifex
        
        🔗 Please join on time.
        `,

        start: {
            dateTime: startDateTime.toISOString(),
            timeZone: "Asia/Kolkata",
        },
        end: {
            dateTime: endDateTime.toISOString(),
            timeZone: "Asia/Kolkata",
        },
        conferenceData: {
            createRequest: {
                requestId: Math.random().toString(),
                conferenceSolutionKey: {
                    type: "hangoutsMeet",
                },
            },
        },
    };

    const response = await calendar.events.insert({
        calendarId: "contact@kanakdigifex.com",
        resource: event,
        conferenceDataVersion: 1,
    });

    return response.data.hangoutLink;
}


// 🟢 Form Page
router.get("/create-live-class", async (req, res) => {

    const courses = await exe(`
        SELECT course_id, course_title 
        FROM courses
    `);

    res.render("admin/create-live-class.ejs", { courses });
});

// 🟢 Form Submit → Auto Meet + DB Save
router.post("/create-live-class", async (req, res) => {

    try {

        const { course_id, class_date, class_time } = req.body;

        // DB madhun correct column gheu
        const course = await exe(
            `SELECT course_title FROM courses WHERE course_id=?`,
            [course_id]
        );

        if (!course.length) {
            return res.send("Course not found");
        }

        const courseName = course[0].course_title;  // ✅ Correct column

        const meetLink = await createMeetAutomatically(courseName, class_date, class_time);

        await exe(`
            INSERT INTO live_classes
            (course_id, class_date, class_time, meet_link)
            VALUES (?, ?, ?, ?)
        `, [course_id, class_date, class_time, meetLink]);

        res.send("Live Class Created Successfully ✅");

    } catch (error) {
        console.log(error);
        res.send("Error creating live class");
    }

});

function checkAdmin(req, res, next) {
    if (req.session.admin_login_id == undefined)
        res.redirect("/login")

    if (req.session.admin_login_id != undefined)
        next();
}

router.get("/", checkAdmin, async function (req, res) {
    var registrations = await exe(`SELECT * FROM registrations_for_course`);
    var data = await exe(`SELECT * FROM internships_registrations`);
    var applications = await exe(`SELECT * FROM job_applications`);
    var customer_workshop = await exe(`SELECT * FROM customer_workshop`);
    var user_contact = await exe(`SELECT * FROM user_contact`);


    var obj = {
        "registrations": registrations,
        "internships": data,
        "applications": applications,
        "customer_workshop": customer_workshop,
        "user_contact": user_contact
    }
    res.render("admin/index.ejs", obj);
});

router.get("/logout", function (req, res) {
    req.session.admin_login_id = undefined;
    res.redirect("/login");
});

router.get("/basic_info", checkAdmin, async function (req, res) {
    var data = await exe('SELECT * FROM basic_info');
    var obj = { "company_info": data[0] };
    res.render("admin/basic_info.ejs", obj);
});

router.post("/save_basic_info", checkAdmin, async function (req, res) {

    if (req.files) {
        var company_logo = prefix + req.files.company_logo.name;
        req.files.company_logo.mv("public/uploads/" + company_logo);

        var d = req.body;
        var sql = `UPDATE basic_info SET company_location = '${d.company_location}',company_mobile = '${d.company_mobile}',company_email = '${d.company_email}',company_work_start = '${d.start_working_hours}',company_work_end = '${d.end_working_hours}',company_address = '${d.company_address}',company_logo = '${company_logo}'`;

        var data = await exe(sql);
    }
    else {
        var d = req.body;
        var sql = `UPDATE basic_info SET company_location = '${d.company_location}', company_mobile = '${d.company_mobile}',company_email = '${d.company_email}',company_work_start = '${d.company_work_start}',company_work_end = '${d.company_work_end}',company_address = '${d.company_address}'`;

        var data = await exe(sql);
    }
    res.redirect("/admin/basic_info")
});

router.get("/banner_images", checkAdmin, async function (req, res) {
    var data = await exe(`SELECT * FROM home_banner`);
    res.render("admin/banner_images.ejs", { "home_banner": data });
});

router.post("/save_banner_images", checkAdmin, async function (req, res) {
    if (req.files) {

        var banner_image = prefix + req.files.banner_image.name;
        req.files.banner_image.mv("public/uploads/" + banner_image);

        var d = req.body;

        var sql = `INSERT INTO home_banner (banner_image,banner_title,banner_sub_title) VALUES ('${banner_image}','${d.banner_title}','${d.banner_sub_title}')`;

        var data = await exe(sql);
    }
    else {
        var d = req.body;

        var sql = `INSERT INTO home_banner (banner_title,banner_sub_title) VALUES ('${d.banner_title}','${d.banner_sub_title}')`;

        var data = await exe(sql);
    }
    res.redirect("/admin/banner_images");
});

router.get("/delete_home_banner/:id", checkAdmin, async function (req, res) {
    var id = req.params.id;
    var data = await exe(`DELETE FROM home_banner WHERE home_banner_id = '${id}'`);
    res.redirect("/admin/banner_images")
});

router.get("/edit_home_banner/:id", checkAdmin, async function (req, res) {
    var id = req.params.id;
    var data = await exe(`SELECT * FROM home_banner WHERE home_banner_id = '${id}'`);
    res.render("admin/edit_home_banner.ejs", { "edit_home_banner": data[0] });
});

router.post("/update_banner_images", checkAdmin, async function (req, res) {
    if (req.files) {

        var banner_image = prefix + req.files.banner_image.name;
        req.files.banner_image.mv("public/uploads/" + banner_image);

        var d = req.body;

        var sql = `UPDATE home_banner SET banner_image = '${banner_image}',banner_title = '${d.banner_title}',banner_sub_title = '${d.banner_sub_title}' WHERE home_banner_Id = '${d.home_banner_Id}'`;

        var data = await exe(sql);
    }
    else {
        var d = req.body;

        var sql = `UPDATE home_banner SET banner_title = '${d.banner_title}',banner_sub_title = '${d.banner_sub_title}' WHERE home_banner_Id = '${d.home_banner_Id}'`;

        var data = await exe(sql);
    }
    res.redirect("/admin/banner_images");
});

// CREATE TABLE home_banner(home_banner_Id INT PRIMARY KEY AUTO_INCREMENT,banner_image TEXT,banner_title TEXT,banner_sub_title TEXT)

router.get("/add_card_section", checkAdmin, async function (req, res) {
    var data = await exe(`SELECT * FROM about_card_section`);
    var obj = { "about_card": data }
    res.render("admin/add_card_section.ejs", obj);
});

router.post("/save_card", checkAdmin, async function (req, res) {
    var d = req.body;

    var about_card_logo = prefix + req.files.about_card_logo.name;
    req.files.about_card_logo.mv("public/uploads/" + about_card_logo);

    var sql = `INSERT INTO about_card_section(add_card_logo,add_card_heading,add_card_button,add_card_sub_heading) VALUES ('${about_card_logo}','${d.about_card_header}','${d.about_card_button}','${d.about_card_sub_heading}')`;

    var data = await exe(sql);
    res.redirect("/admin/add_card_section");
});

router.get("/delete_about_card/:id", checkAdmin, async function (req, res) {
    var id = req.params.id;
    var sql = `DELETE FROM about_card_section WHERE about_card_id = '${id}'`;
    var data = await exe(sql);
    res.redirect("/admin/add_card_section");
});

router.get("/edit_about_card/:id", checkAdmin, async function (req, res) {
    var id = req.params.id;
    var sql = `SELECT * FROM about_card_section WHERE about_card_id = '${id}'`;
    var data = await exe(sql);
    res.render("admin/edit_about_card.ejs", { "edit_about_card": data[0] });
});

router.post("/update_about_card", checkAdmin, async function (req, res) {


    if (req.files) {

        var about_card_logo = prefix + req.files.about_card_logo.name;
        req.files.about_card_logo.mv("public/uploads/" + about_card_logo);

        var d = req.body;

        var sql = `UPDATE about_card_section SET add_card_logo = '${about_card_logo}',add_card_heading = '${d.about_card_header}',add_card_button = '${d.about_card_button}',add_card_sub_heading = '${d.about_card_sub_heading}' WHERE about_card_id = '${d.about_card_id}'`

        var data = await exe(sql);

    }
    else {
        var d = req.body;

        var sql = `UPDATE about_card_section SET add_card_heading = '${d.about_card_header}',add_card_button = '${d.about_card_button}',add_card_sub_heading = '${d.about_card_sub_heading}' WHERE about_card_id = '${d.about_card_id}'`

        var data = await exe(sql);

    }
    res.redirect("/admin/add_card_section");

});

// /about_kanak_digifex page

router.get("/about_kanak_digifex", checkAdmin, async function (req, res) {
    var data = await exe(`SELECT * FROM about_kanak_digifex`);
    var obj = { "about_kanak": data[0] }
    res.render("admin/about_kanak_digifex.ejs", obj);
});

router.post("/save_about_kanak", checkAdmin, async function (req, res) {

    if (req.files) {
        var about_image = prefix + req.files.about_image.name;
        req.files.about_image.mv("public/uploads/" + about_image);

        var d = req.body;

        var sql = `UPDATE about_kanak_digifex SET about_heading = '${d.about_heading}',about_sub_heading = '${d.about_sub_heading}',about_description = '${d.about_description}',about_button_link = '${d.about_button_link}', about_image = '${about_image}'`;

        var data = await exe(sql);
    }
    else {
        var d = req.body;
        var sql = `UPDATE about_kanak_digifex SET about_heading = '${d.about_heading}', about_sub_heading = '${d.about_sub_heading}',about_description = '${d.about_description}',about_button_link = '${d.about_button_link}'`;

        var data = await exe(sql);
    }
    res.redirect("/admin/about_kanak_digifex")
});

// End

router.get("/offered_courses", checkAdmin, async function (req, res) {
    var data = await exe(`SELECT * FROM offered_courses`);
    res.render("admin/offered_courses.ejs", { "offered_courses": data[0] });
});

router.post("/save_course_details", checkAdmin, async function (req, res) {
    var d = req.body;
    var sql = `UPDATE offered_courses SET course_heading = '${d.course_heading}',course_sub_heading = '${d.course_sub_heading}',course_description = '${d.course_description}'`;
    var data = await exe(sql);

    res.redirect("/admin/offered_courses");
});

// End

router.get("/all_courses", checkAdmin, async function (req, res) {
    res.render("admin/all_courses.ejs");
});

// ================= SERVICES =================

router.get("/all_services", checkAdmin, async function (req, res) {

    res.render("admin/all_services.ejs");

});

// slugify function (हे वर define कर)
function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')        // spaces → dash
        .replace(/[^\w\-]+/g, '')    // special chars काढून टाक
        .replace(/\-\-+/g, '-');     // multiple dash → single dash
}

router.post("/save_course", checkAdmin, async function (req, res) {
    try {
        let course_image = null;
        let d = req.body;

        // slug तयार कर
        let slug = slugify(d.course_title);

        // जर file असेल तर upload कर
        if (req.files && req.files.course_image) {
            course_image = prefix + req.files.course_image.name;
            await req.files.course_image.mv("public/uploads/" + course_image);
        }

        // जर image असेल
        if (course_image) {
            var sql = `INSERT INTO courses 
              (course_image, course_title, slug, course_sub_title, course_duration, course_price, course_details, course_button_link) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

            await exe(sql, [
                course_image,
                d.course_title,
                slug,
                d.course_sub_title,
                d.course_duration,
                d.course_price,
                d.course_details,
                d.course_button_link
            ]);
        } else {
            // image नसेल तर
            var sql = `INSERT INTO courses 
              (course_title, slug, course_sub_title, course_duration, course_price, course_details, course_button_link) 
              VALUES (?, ?, ?, ?, ?, ?, ?)`;

            await exe(sql, [
                d.course_title,
                slug,
                d.course_sub_title,
                d.course_duration,
                d.course_price,
                d.course_details,
                d.course_button_link
            ]);
        }

        res.redirect("/admin/all_courses");
    } catch (err) {
        console.error("Error saving course:", err);
        res.status(500).send("Error saving course");
    }
});

router.post("/save_service", checkAdmin, async function (req, res) {

    try {

        let d = req.body;

        let service_image = "";

        let slug = slugify(d.service_title);

        if (req.files && req.files.service_image) {

            service_image =
                prefix + req.files.service_image.name;

            await req.files.service_image.mv(
                "public/uploads/" + service_image
            );
        }

        await exe(`
        INSERT INTO services
        (
            service_title,
            service_slug,
            service_image,
            point1,
            point2,
            point3,
            point4,
            service_description,
            status,
            seo_title,
            meta_description,
            meta_keywords,
            seo_content,
            faq_question1,
            faq_answer1,
            faq_question2,
            faq_answer2,
            faq_question3,
            faq_answer3,
            faq_question4,
            faq_answer4,
            faq_question5,
            faq_answer5,
            faq_question6,
            faq_answer6,
            faq_question7,
            faq_answer7,
            faq_question8,
            faq_answer8,
            faq_question9,
            faq_answer9,
            faq_question10,
            faq_answer10
        )
        VALUES
        (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        `,
            [
                d.service_title,
                slug,
                service_image,

                d.point1,
                d.point2,
                d.point3,
                d.point4,

                d.service_description,
                d.status,

                d.seo_title,
                d.meta_description,
                d.meta_keywords,
                d.seo_content,

                d.faq_question1,
                d.faq_answer1,

                d.faq_question2,
                d.faq_answer2,

                d.faq_question3,
                d.faq_answer3,

                d.faq_question4,
                d.faq_answer4,

                d.faq_question5,
                d.faq_answer5,

                d.faq_question6,
                d.faq_answer6,

                d.faq_question7,
                d.faq_answer7,

                d.faq_question8,
                d.faq_answer8,

                d.faq_question9,
                d.faq_answer9,

                d.faq_question10,
                d.faq_answer10
            ]
        );

        res.redirect("/admin/service_list");

    } catch (error) {

        console.log(error);
        res.send(error);

    }

});


router.get("/course_list", checkAdmin, async function (req, res) {
    var data = await exe(`SELECT * FROM courses`)
    res.render("admin/course_list.ejs", { "courses": data });
});

router.get("/delete_courses/:id", checkAdmin, async function (req, res) {
    var id = req.params.id;
    var data = await exe(`DELETE FROM courses WHERE course_id = '${id}'`);
    res.redirect("/admin/course_list");
});

router.get("/edit_course/:id", checkAdmin, async function (req, res) {
    var id = req.params.id;
    var data = await exe(`SELECT * FROM courses WHERE course_id = '${id}'`);
    res.render("admin/edit_course.ejs", { "course_info": data[0] });
});

// slugify function वर आधी define केलेला वापरा

router.post("/update_course", checkAdmin, async function (req, res) {
    try {
        let d = req.body;
        let course_image = null;

        // slug तयार कर course_title वरून
        let slug = slugify(d.course_title);

        // जर नवीन image असेल तर upload करा
        if (req.files && req.files.course_image) {
            course_image = prefix + req.files.course_image.name;
            await req.files.course_image.mv("public/uploads/" + course_image);

            var sql = `UPDATE courses 
                       SET course_image = ?, 
                           course_title = ?, 
                           slug = ?, 
                           course_sub_title = ?, 
                           course_duration = ?, 
                           course_price = ?, 
                           course_details = ?, 
                           course_button_link = ? 
                       WHERE course_id = ?`;

            await exe(sql, [
                course_image,
                d.course_title,
                slug,
                d.course_sub_title,
                d.course_duration,
                d.course_price,
                d.course_details,
                d.course_button_link,
                d.course_id
            ]);
        } else {
            // image update नाही
            var sql = `UPDATE courses 
                       SET course_title = ?, 
                           slug = ?, 
                           course_sub_title = ?, 
                           course_duration = ?, 
                           course_price = ?, 
                           course_details = ?, 
                           course_button_link = ? 
                       WHERE course_id = ?`;

            await exe(sql, [
                d.course_title,
                slug,
                d.course_sub_title,
                d.course_duration,
                d.course_price,
                d.course_details,
                d.course_button_link,
                d.course_id
            ]);
        }

        res.redirect("/admin/course_list");
    } catch (err) {
        console.error("Error updating course:", err);
        res.status(500).send("Error updating course");
    }
});


router.get("/business_solutions", checkAdmin, async function (req, res) {
    res.render("admin/business_solutions.ejs");
});

router.post("/save_business", checkAdmin, async function (req, res) {
    if (req.files) {

        var business_image = prefix + req.files.business_image.name;
        req.files.business_image.mv("public/uploads/" + business_image);

        var d = req.body;

        var sql = `INSERT INTO business_solution(business_image,business_title,business_button_link) VALUES ('${business_image}','${d.business_title}','${d.business_button_link}')`;

        var data = await exe(sql);

    }
    else {

        var d = req.body;

        var sql = `INSERT INTO business_solution(business_title,business_button_link) VALUES ('${d.business_title}','${d.business_button_link}')`;

        var data = await exe(sql)
    }
    res.redirect("/admin/business_solutions");
});

router.get("/business_list", checkAdmin, async function (req, res) {
    var data = await exe(`SELECT * FROM business_solution`)
    res.render("admin/business_list.ejs", { "business_solution": data });
});

router.get("/delete_business/:id", checkAdmin, async function (req, res) {
    var id = req.params.id;
    var data = await exe(`DELETE FROM business_solution WHERE business_id = '${id}'`);
    res.redirect("/admin/business_list");
});

router.get("/edit_business/:id", checkAdmin, async function (req, res) {
    var id = req.params.id;
    var data = await exe(`SELECT * FROM business_solution WHERE business_id = '${id}'`);
    res.render("admin/edit_business.ejs", { "business_info": data[0] });
});

router.post("/update_business", checkAdmin, async function (req, res) {
    if (req.files) {

        var business_image = prefix + req.files.business_image.name;
        req.files.business_image.mv("public/uploads/" + business_image);

        var d = req.body;

        var sql = `UPDATE business_solution SET business_image = '${business_image}',business_title = '${d.business_title}',business_button_link = '${d.business_button_link}' WHERE business_id = '${d.business_id}'`;

        var data = await exe(sql)

    }
    else {

        var d = req.body;

        var sql = `UPDATE business_solution SET business_title = '${d.business_title}',business_button_link = '${d.business_button_link}' WHERE business_id = '${d.business_id}'`;

        var data = await exe(sql)
    }
    res.redirect("/admin/business_list");
});

router.get("/why_kanak_digifex", checkAdmin, async function (req, res) {
    var data = await exe(`SELECT * FROM why_kanak_digifex`);
    res.render("admin/why_kanak_digifex.ejs", { "digifex": data[0] })
});

router.post("/save_digifex_info", checkAdmin, async function (req, res) {

    var d = req.body;
    var sql = `UPDATE why_kanak_digifex SET digifex_title = '${d.digifex_title}',digifex_sub_title = '${d.digifex_sub_title}',digifex_description = '${d.digifex_description}'`;

    var data = await exe(sql);

    res.redirect("/admin/why_kanak_digifex")
});

router.get("/company_policy", checkAdmin, async function (req, res) {
    var data = await exe(`SELECT * FROM company_policy`);
    res.render("admin/company_policy.ejs", { "policy": data });
});

router.post("/save_company_policy", checkAdmin, async function (req, res) {
    if (req.files) {

        var company_policy_image = prefix + req.files.company_policy_image.name;
        req.files.company_policy_image.mv("public/uploads/" + company_policy_image);

        var d = req.body;

        var sql = `INSERT INTO company_policy(company_policy_image,company_policy_title,company_policy_description) VALUES ('${company_policy_image}','${d.company_policy_title}','${d.company_policy_description}')`;

        var data = await exe(sql);
    }
    else {
        var d = req.body;

        var sql = `INSERT INTO company_policy(company_policy_title,company_policy_description) VALUES ('${d.company_policy_title}','${d.company_policy_description}')`

        var data = await exe(sql)
    }
    res.redirect("/admin/company_policy");
});

router.get("/delete_company_policy/:id", checkAdmin, async function (req, res) {
    var id = req.params.id;
    var data = await exe(`DELETE FROM company_policy WHERE policy_id = '${id}'`);
    res.redirect("/admin/company_policy");
});


router.get("/edit_company_policy/:id", checkAdmin, async function (req, res) {
    var id = req.params.id;
    var data = await exe(`SELECT * FROM company_policy WHERE policy_id = '${id}'`);
    res.render("admin/edit_company_policy.ejs", { "company_policy": data[0] });
});

router.post("/update_company_policy", checkAdmin, async function (req, res) {
    if (req.files) {

        var company_policy_image = prefix + req.files.company_policy_image.name;
        req.files.company_policy_image.mv("public/uploads/" + company_policy_image);

        var d = req.body;

        var sql = `UPDATE company_policy SET company_policy_image = '${company_policy_image}',company_policy_title = '${d.company_policy_title}',company_policy_description = '${d.company_policy_description}' WHERE policy_id = '${d.policy_id}'`;

        var data = await exe(sql)

    }
    else {

        var d = req.body;

        var sql = `UPDATE company_policy SET company_policy_title = '${d.company_policy_title}',company_policy_description = '${d.company_policy_description}' WHERE policy_id = '${d.policy_id}'`;

        var data = await exe(sql)
    }
    res.redirect("/admin/company_policy");
});

// about us start

router.get("/about", checkAdmin, async function (req, res) {
    var data = await exe(`SELECT * FROM about_us`);
    res.render("admin/about.ejs", { "about": data[0] });
});

router.post("/save_about", checkAdmin, async function (req, res) {

    if (req.files) {
        var about_image = prefix + req.files.about_image.name;
        req.files.about_image.mv("public/uploads/" + about_image);

        var d = req.body;
        var sql = `UPDATE about_us SET about_image = '${about_image}',about_title = '${d.about_title}',about_sub_title = '${d.about_sub_title}',about_description_1 = '${d.about_description_1}',about_description_2 = '${d.about_description_2}',about_description_3 = '${d.about_description_3}',about_description_4 = '${d.about_description_4}',about_description_5 = '${d.about_description_5}',about_description_6 = '${d.about_description_6}'`;

        var data = await exe(sql);
    }
    else {
        var d = req.body;
        var sql = `UPDATE about_us SET about_title = '${d.about_title}',about_sub_title = '${d.about_sub_title}',about_description_1 = '${d.about_description_1}',about_description_2 = '${d.about_description_2}',about_description_3 = '${d.about_description_3}',about_description_4 = '${d.about_description_4}',about_description_5 = '${d.about_description_5}',about_description_6 = '${d.about_description_6}'`;

        var data = await exe(sql);
    }
    res.redirect("/admin/about")
});

router.get("/our_team", checkAdmin, async function (req, res) {
    var employee = await exe(`SELECT * FROM our_team`);
    res.render("admin/our_team.ejs", { "employee": employee });
});

router.post("/save_employee", checkAdmin, async function (req, res) {
    if (req.files) {

        var employee_image = prefix + req.files.employee_image.name;
        req.files.employee_image.mv("public/uploads/" + employee_image);

        var d = req.body;

        var sql = `INSERT INTO our_team(employee_image,employee_name,employee_position) VALUES ('${employee_image}','${d.employee_name}','${d.employee_position}')`;

        var data = await exe(sql);
    }
    else {
        var d = req.body;

        var sql = `INSERT INTO our_team(employee_name,employee_position) VALUES ('${d.employee_name}','${d.employee_position}')`;

        var data = await exe(sql)
    }
    res.redirect("/admin/our_team");
});

router.get("/delete_employee/:id", checkAdmin, async function (req, res) {
    var id = req.params.id;
    var data = await exe(`DELETE FROM our_team WHERE employee_id = '${id}'`);
    res.redirect("/admin/our_team");
});

router.get("/edit_employee/:id", checkAdmin, async function (req, res) {
    var id = req.params.id;
    var data = await exe(`SELECT * FROM our_team WHERE employee_id = '${id}'`);
    res.render("admin/edit_employee.ejs", { "employee": data[0] });
});

router.post("/update_employee", checkAdmin, async function (req, res) {
    if (req.files) {
        var employee_image = prefix + req.files.employee_image.name;
        req.files.employee_image.mv("public/uploads/" + employee_image);

        var d = req.body;

        var sql = `UPDATE our_team SET employee_image = '${employee_image}',employee_name = '${d.employee_name}',employee_position = '${d.employee_position}' WHERE employee_id = '${d.employee_id}'`;

        var data = await exe(sql);
    }
    else {
        var d = req.body;

        var sql = `UPDATE our_team SET employee_name = '${d.employee_name}',employee_position = '${d.employee_position}' WHERE employee_id = '${d.employee_id}'`;

        var data = await exe(sql);
    }
    res.redirect("/admin/our_team");
});

router.get("/products", checkAdmin, async function (req, res) {
    var data = await exe(`SELECT * FROM product`)
    res.render("admin/product.ejs", { "product": data });
});

router.post("/save_product", checkAdmin, async function (req, res) {
    if (req.files) {

        var product_image = prefix + req.files.product_image.name;
        req.files.product_image.mv("public/uploads/" + product_image);

        var d = req.body;

        var sql = `INSERT INTO product (product_image) VALUES ('${product_image}')`;

        var data = await exe(sql);
    }
    res.redirect("/admin/products");
});

router.get("/delete_product/:id", checkAdmin, async function (req, res) {
    var id = req.params.id;
    var data = await exe(`DELETE FROM product WHERE product_id = '${id}'`);
    res.redirect("/admin/products");
});

router.get("/edit_product/:id", checkAdmin, async function (req, res) {
    var id = req.params.id;
    var data = await exe(`SELECT * FROM product WHERE product_id = '${id}'`);
    res.render("admin/edit_product.ejs", { "product": data[0] });
});

router.post("/update_product", checkAdmin, async function (req, res) {
    if (req.files) {
        var product_image = prefix + req.files.product_image.name;
        req.files.product_image.mv("public/uploads/" + product_image);

        var d = req.body;

        var sql = `UPDATE product SET product_image = '${product_image}' WHERE product_id = '${d.product_id}'`;

        var data = await exe(sql);
    }
    res.redirect("/admin/products")
});

router.get("/customer_reviews", checkAdmin, async function (req, res) {
    var reviews = await exe('SELECT * FROM customer_reviews');
    res.render("admin/customer_reviews.ejs", { "reviews": reviews })
});

router.get("/delete_review/:id", checkAdmin, async function (req, res) {
    var id = req.params.id;
    var data = await exe(`DELETE FROM customer_reviews WHERE customer_id = '${id}'`);
    res.redirect("/admin/customer_reviews");
});

router.get("/our_gallery", checkAdmin, async function (req, res) {
    var gallery = await exe(`SELECT * FROM gallery`)
    res.render("admin/our_gallery.ejs", { "gallery": gallery });
});

router.post("/save_gallery", checkAdmin, async function (req, res) {
    if (req.files) {

        var gallery_image = prefix + req.files.gallery_image.name;
        req.files.gallery_image.mv("public/uploads/" + gallery_image);

        var d = req.body;

        var sql = `INSERT INTO gallery (gallery_image) VALUES ('${gallery_image}')`;

        var data = await exe(sql);
    }
    res.redirect("/admin/our_gallery");
});

router.get("/delete_gallery/:id", checkAdmin, async function (req, res) {
    var id = req.params.id;
    var data = await exe(`DELETE FROM gallery WHERE image_id = '${id}'`);
    res.redirect("/admin/our_gallery");
});

router.get("/edit_gallery/:id", checkAdmin, async function (req, res) {
    var id = req.params.id;
    var data = await exe(`SELECT * FROM gallery WHERE image_id = '${id}'`);
    res.render("admin/edit_gallery.ejs", { "gallery": data[0] });
});


router.post("/update_gallery", checkAdmin, async function (req, res) {
    if (req.files) {
        var gallery_image = prefix + req.files.gallery_image.name;
        req.files.gallery_image.mv("public/uploads/" + gallery_image);

        var d = req.body;

        var sql = `UPDATE gallery SET gallery_image = '${gallery_image}' WHERE image_id = '${d.image_id}'`;

        var data = await exe(sql);
    }
    res.redirect("/admin/our_gallery")
});

router.get("/our_associates", checkAdmin, async function (req, res) {
    var associates = await exe(`SELECT * FROM associates`)
    res.render("admin/our_associates.ejs", { "associates": associates });
});

router.post("/save_associates", checkAdmin, async function (req, res) {
    if (req.files) {

        var associates_image = prefix + req.files.associates_image.name;
        req.files.associates_image.mv("public/uploads/" + associates_image);

        var d = req.body;

        var sql = `INSERT INTO associates (associates_image) VALUES ('${associates_image}')`;

        var data = await exe(sql);
    }
    res.redirect("/admin/our_associates");
});

router.get("/delete_associates/:id", checkAdmin, async function (req, res) {
    var id = req.params.id;
    var data = await exe(`DELETE FROM associates WHERE image_id = '${id}'`);
    res.redirect("/admin/our_associates");
});

router.get("/edit_associates/:id", checkAdmin, async function (req, res) {
    var id = req.params.id;
    var data = await exe(`SELECT * FROM associates WHERE image_id = '${id}'`);
    res.render("admin/edit_associates.ejs", { "associates": data[0] });
});


router.post("/update_associates", checkAdmin, async function (req, res) {
    if (req.files) {
        var associates_image = prefix + req.files.associates_image.name;
        req.files.associates_image.mv("public/uploads/" + associates_image);

        var d = req.body;

        var sql = `UPDATE associates SET associates_image = '${associates_image}' WHERE image_id = '${d.image_id}'`;

        var data = await exe(sql);
    }
    res.redirect("/admin/our_associates")
});

router.get("/all_workshop", checkAdmin, async function (req, res) {
    res.render("admin/all_workshop.ejs");
});


router.post("/save_workshop", checkAdmin, async function (req, res) {
    if (req.files) {

        var workshop_image = prefix + req.files.workshop_image.name;

        req.files.workshop_image.mv("public/uploads/" + workshop_image);

        var d = req.body;

        var sql = `INSERT INTO workshop(workshop_image,workshop_title,workshop_sub_title,workshop_duration,workshop_date,workshop_price,workshop_details) VALUES ('${workshop_image}','${d.workshop_title}','${d.workshop_sub_title}','${d.workshop_duration}','${d.workshop_date}','${d.workshop_price}','${d.workshop_details}')`;

        var data = await exe(sql)

    }
    else {

        var d = req.body;

        var sql = `INSERT INTO workshop(workshop_title,workshop_sub_title,workshop_duration,workshop_date,workshop_price,workshop_details) VALUES ('${d.workshop_title}','${d.workshop_sub_title}','${d.workshop_duration}','${d.workshop_date}','${d.workshop_price}','${d.workshop_details}')`;


        var data = await exe(sql)
    }
    res.redirect("/admin/all_workshop");
});

router.get("/workshop_list", checkAdmin, async function (req, res) {
    var data = await exe(`SELECT * FROM workshop`)
    res.render("admin/workshop_list.ejs", { "workshop": data });
});

router.get("/delete_workshop/:id", checkAdmin, async function (req, res) {
    var id = req.params.id;
    var data = await exe(`DELETE FROM workshop WHERE workshop_id = '${id}'`);
    res.redirect("/admin/workshop_list");
});

router.get("/edit_workshop/:id", checkAdmin, async function (req, res) {
    var id = req.params.id;
    var data = await exe(`SELECT * FROM workshop WHERE workshop_id = '${id}'`);
    res.render("admin/edit_workshop.ejs", { "workshop_info": data[0] });
});

router.post("/update_workshop", checkAdmin, async function (req, res) {
    if (req.files) {

        var workshop_image = prefix + req.files.workshop_image.name;

        req.files.workshop_image.mv("public/uploads/" + workshop_image);

        var d = req.body;

        var sql = `UPDATE workshop SET workshop_image = '${workshop_image}',workshop_title = '${d.workshop_title}',workshop_sub_title = '${d.workshop_sub_title}',workshop_duration = '${d.workshop_duration}',workshop_date = '${d.workshop_date}',workshop_price = '${d.workshop_price}',workshop_details = '${d.workshop_details}' WHERE workshop_id = '${d.workshop_id}'`;

        var data = await exe(sql)

    }
    else {

        var d = req.body;

        var sql = `UPDATE workshop SET workshop_title = '${d.workshop_title}',workshop_sub_title = '${d.workshop_sub_title}',workshop_duration = '${d.workshop_duration}',workshop_date = '${d.workshop_date}',workshop_price = '${d.workshop_price}',workshop_details = '${d.workshop_details}' WHERE workshop_id = '${d.workshop_id}'`;


        var data = await exe(sql)
    }
    res.redirect("/admin/workshop_list");
});

router.get("/certification", checkAdmin, async function (req, res) {
    res.render("admin/certifiction.ejs")
});

router.post("/save_certificate", checkAdmin, async function (req, res) {

    if (req.files) {
        var student_certificate = prefix + req.files.student_certificate.name;

        req.files.student_certificate.mv("public/uploads/" + student_certificate);

        var d = req.body;

        // Data Cleaning: Ensure only selected certificate type has value, others are NULL
        let course_name = d.certificate_type === "course" ? d.course_name : null;
        let workshop_name = d.certificate_type === "workshop" ? d.workshop_name : null;
        let internship_name = d.certificate_type === "internship" ? d.internship_name : null;

        var sql = `INSERT INTO student_certificates 
                (student_name, student_mobile, student_certificate, certificate_type, 
                course_name, workshop_name, internship_name, student_certificate_number) 
                VALUES ('${d.student_name}', '${d.student_mobile}', '${student_certificate}', '${d.certificate_type}', 
                ${course_name ? `'${course_name}'` : "NULL"}, 
                ${workshop_name ? `'${workshop_name}'` : "NULL"}, 
                ${internship_name ? `'${internship_name}'` : "NULL"}, 
                '${d.student_certificate_number}')`;


        var data = await exe(sql);
    } else {
        var d = req.body;

        // Data Cleaning: Ensure only selected certificate type has value, others are NULL
        let course_name = d.certificate_type === "course" ? d.course_name : null;
        let workshop_name = d.certificate_type === "workshop" ? d.workshop_name : null;
        let internship_name = d.certificate_type === "internship" ? d.internship_name : null;

        var sql = `INSERT INTO student_certificates 
                (student_name, student_mobile, student_certificate, certificate_type, 
                course_name, workshop_name, internship_name, student_certificate_number) 
                VALUES ('${d.student_name}', '${d.student_mobile}', '${student_certificate}', '${d.certificate_type}', 
                ${course_name ? `'${course_name}'` : "NULL"}, 
                ${workshop_name ? `'${workshop_name}'` : "NULL"}, 
                ${internship_name ? `'${internship_name}'` : "NULL"}, 
                '${d.student_certificate_number}')`;


        var data = await exe(sql);
    }
    res.redirect("/admin/certification");
});

router.get("/certificate_list", checkAdmin, async function (req, res) {
    var data = await exe(`SELECT * FROM student_certificates`);
    res.render("admin/certificate_list.ejs", { "certificates": data });
});

router.get("/delete_certificate/:id", async function (req, res) {
    var id = req.params.id;
    var data = await exe(`DELETE FROM student_certificates WHERE id = '${id}'`);
    res.redirect("/admin/certificate_list");
});

router.get("/edit_certificate/:id", async function (req, res) {
    var data = await exe(`SELECT * FROM student_certificates WHERE id = '${req.params.id}'`);
    res.render("admin/edit_certificate.ejs", { "edit_certificate": data[0] });
});

router.post("/update_certificate", async function (req, res) {
    if (req.files) {
        var student_certificate = prefix + req.files.student_certificate.name;

        req.files.student_certificate.mv("public/uploads/" + student_certificate);

        var d = req.body;

        var sql = `UPDATE student_certificates 
                    SET 
                        student_name = '${d.student_name}', 
                        student_mobile = '${d.student_mobile}', 
                        student_certificate = '${student_certificate}', 
                        certificate_type = '${d.certificate_type}', 
                        course_name = CASE WHEN '${d.certificate_type}' = 'course' THEN '${d.course_name}' ELSE NULL END, 
                        workshop_name = CASE WHEN '${d.certificate_type}' = 'workshop' THEN '${d.workshop_name}' ELSE NULL END, 
                        internship_name = CASE WHEN '${d.certificate_type}' = 'internship' THEN '${d.internship_name}' ELSE NULL END, 
                        student_certificate_number = '${d.student_certificate_number}' 
                    WHERE id = '${d.id}';
                    `;
        var data = await exe(sql);
    }
    else {
        var d = req.body;

        var sql = `UPDATE student_certificates 
        SET 
            student_name = '${d.student_name}', 
            student_mobile = '${d.student_mobile}', 
            certificate_type = '${d.certificate_type}', 
            course_name = CASE WHEN '${d.certificate_type}' = 'course' THEN '${d.course_name}' ELSE NULL END, 
            workshop_name = CASE WHEN '${d.certificate_type}' = 'workshop' THEN '${d.workshop_name}' ELSE NULL END, 
            internship_name = CASE WHEN '${d.certificate_type}' = 'internship' THEN '${d.internship_name}' ELSE NULL END, 
            student_certificate_number = '${d.student_certificate_number}' 
        WHERE id = '${d.id}';
        `;
        var data = await exe(sql);
    }
    res.redirect("/admin/certificate_list");
});

// CREATE TABLE student_certificates (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     student_name VARCHAR(255) NOT NULL,
//     student_mobile VARCHAR(10) NOT NULL,
//     student_certificate VARCHAR(255) NOT NULL, -- File path save hoil
//     certificate_type ENUM('course', 'workshop', 'internship') NOT NULL,
//     course_name VARCHAR(255) DEFAULT NULL,
//     workshop_name VARCHAR(255) DEFAULT NULL,
//     internship_name VARCHAR(255) DEFAULT NULL,
//     student_certificate_number VARCHAR(50) UNIQUE NOT NULL,
// );


router.get("/customer_workshop", checkAdmin, async function (req, res) {
    var customer_workshop = await exe(`SELECT * FROM customer_workshop`);
    res.render("admin/customer_workshop.ejs", { "customer_workshop": customer_workshop });
});

router.get("/delete_customer_workshop/:id", checkAdmin, async function (req, res) {
    var id = req.params.id;
    var data = await exe(`DELETE FROM customer_workshop WHERE customer_id = '${id}'`);
    res.redirect("/admin/customer_workshop");
});

router.get("/user_contact", checkAdmin, async function (req, res) {
    var data = await exe(`SELECT * FROM user_contact`)
    res.render("admin/user_contact.ejs", { "user_contact": data });
});

router.get("/delete_user_contact/:id", checkAdmin, async function (req, res) {
    var id = req.params.id;
    var data = await exe(`DELETE FROM user_contact WHERE user_contact_id = '${id}'`);
    res.redirect("/admin/user_contact");
});

router.get("/company_office_address", checkAdmin, async function (req, res) {
    var office = await exe('SELECT * FROM office_address');
    res.render("admin/company_office_address.ejs", { "office": office });
});

router.post("/save_office_address", checkAdmin, async function (req, res) {
    var d = req.body;

    var sql = `INSERT INTO office_address(office_location,office_detail_address,office_mobile,office_email,office_map_link) VALUES ('${d.office_location}','${d.office_detail_address}','${d.office_mobile}','${d.office_email}','${d.office_map_link}')`;

    var data = await exe(sql);

    res.redirect("/admin/company_office_address");
});

router.get("/delete_office/:id", checkAdmin, async function (req, res) {
    var id = req.params.id;
    var data = await exe(`DELETE FROM office_address WHERE office_id = '${id}'`);
    res.redirect("/admin/company_office_address");
});

router.get("/edit_office/:id", checkAdmin, async function (req, res) {
    var id = req.params.id;
    var data = await exe(`SELECT * FROM office_address WHERE office_id = '${id}'`);
    res.render("admin/edit_office.ejs", { "office": data[0] });
});

router.post("/update_office", checkAdmin, async function (req, res) {

    var d = req.body;

    var sql = `UPDATE office_address SET office_location = '${d.office_location}',office_detail_address = '${d.office_detail_address}',office_mobile = '${d.office_mobile}',office_email = '${d.office_email}',office_map_link = '${d.office_map_link}' WHERE office_id = '${d.office_id}'`;

    var data = await exe(sql)

    res.redirect("/admin/company_office_address");
});

// End

router.get("/user_footer", checkAdmin, async function (req, res) {
    var user_footer = await exe(`SELECT * FROM user_footer`);
    res.render("admin/user_footer.ejs", { "institute_name": user_footer });
});

router.post("/save_institute", checkAdmin, async function (req, res) {
    var d = req.body;
    var sql = `INSERT INTO user_footer(institute_name) VALUES('${d.institute_name}')`;
    var data = await exe(sql);
    res.redirect("/admin/user_footer");
});

router.get("/delete_institute_name/:id", checkAdmin, async function (req, res) {
    var id = req.params.id;
    var data = await exe(`DELETE FROM user_footer WHERE institute_id = '${id}'`);
    res.redirect("/admin/user_footer");
});

// End

router.get("/disclaimer", checkAdmin, async function (req, res) {
    var disclaimer = await exe(`SELECT * FROM disclaimer`);
    res.render("admin/disclaimer.ejs", { "disclaimer": disclaimer[0] });
});

router.post("/save_disclaimer", checkAdmin, async function (req, res) {
    var d = req.body;
    var sql = `UPDATE disclaimer SET disclaimer_details = '${d.disclaimer_details}'`;
    var data = await exe(sql);
    res.redirect("/admin/disclaimer");
});

// End

router.get("/certification_images", checkAdmin, async function (req, res) {
    var certification_images = await exe(`SELECT * FROM certification_images`);
    res.render("admin/certification_images.ejs", { "certification_images": certification_images });
});

router.post("/save_certification_images", checkAdmin, async function (req, res) {
    if (req.files) {
        var certification_image = prefix + req.files.certification_image.name;
        req.files.certification_image.mv("public/uploads/" + certification_image);

        var d = req.body;

        var sql = `INSERT INTO certification_images(certification_image) VALUES('${certification_image}')`;

        var data = await exe(sql);
    }
    res.redirect("/admin/certification_images");
});

router.get("/delete_certification_images/:id", checkAdmin, async function (req, res) {
    var id = req.params.id;
    var data = await exe(`DELETE FROM certification_images WHERE certification_id = '${id}'`);
    res.redirect("/admin/certification_images");
});

router.get("/registrations_for_course", checkAdmin, async function (req, res) {
    var registrations = await exe(`SELECT * FROM registrations_for_course`);
    var obj = {
        "registrations": registrations
    }
    res.render("admin/registrations_for_course.ejs", obj);
});

router.get("/delete_registration/:id", checkAdmin, async function (req, res) {
    var id = req.params.id;
    var data = await exe(`DELETE FROM registrations_for_course WHERE registration_id = '${id}'`);
    res.redirect("/admin/registrations_for_course");
});

router.get("/registrations_for_internships", checkAdmin, async function (req, res) {
    var data = await exe(`SELECT * FROM internships_registrations`);
    var obj = { "internships": data }
    res.render("admin/registrations_for_internships.ejs", obj);
});

router.get("/delete_internship_registration/:id", checkAdmin, async function (req, res) {
    var id = req.params.id;
    var data = await exe(`DELETE FROM internships_registrations WHERE internships_registrations_id = '${id}'`);
    res.redirect("/admin/registrations_for_internships");
});

router.get("/job_applications", checkAdmin, async function (req, res) {
    var data = await exe(`SELECT * FROM job_applications`);
    var obj = { "applications": data }
    res.render("admin/job_applications.ejs", obj);
});

router.get("/delete_job_applications/:id", checkAdmin, async function (req, res) {
    var id = req.params.id;
    var data = await exe(`DELETE FROM job_applications WHERE applications_id = '${id}'`);
    res.redirect("/admin/job_applications");
});

router.get("/job_search_candidate_list", checkAdmin, async function (req, res) {
    var candidates = await exe(`SELECT * FROM job_search_candidates`);
    res.render("admin/job_search_candidate_list.ejs", { "candidates": candidates });
});

router.get("/delete_candidate/:id", checkAdmin, async function (req, res) {
    var id = req.params.id;
    var data = await exe(`DELETE FROM job_search_candidates WHERE id = '${id}'`);
    res.redirect("/admin/job_search_candidate_list");
});

router.get("/industrial_visit_list", checkAdmin, async function (req, res) {
    var data = await exe(`SELECT * FROM ind_visit_reg ORDER BY id DESC`);
    res.render("admin/ind_visit_list.ejs", { "ind_visit_reg": data });
});

router.get("/adsul_guest_lecture_reg_list", checkAdmin, async function (req, res) {
    var data = await exe(`SELECT * FROM adsul_guest_lecture_reg ORDER BY id DESC`);
    res.render("admin/adsul_guest_lecture_reg_list.ejs", { "adsul_guest_lecture_reg": data });
});

router.get("/samarth_guest_lecture_reg_list", checkAdmin, async function (req, res) {
    var data = await exe(`SELECT * FROM samarth_college_guest_lecture_reg`);
    res.render("admin/samarth_guest_lecture_reg_list.ejs", { "samarth_guest_lecture_reg": data });
});

router.get("/adsul_ind_visit_list", checkAdmin, async function (req, res) {
    var data = await exe(`SELECT * FROM adsul_ind_visit_reg`);
    res.render("admin/adsul_ind_visit_list.ejs", { "adsul_ind_visit_reg": data });
});

router.get("/vishwabharati_guest_lecture_reg_list", checkAdmin, async function (req, res) {
    var data = await exe(`SELECT * FROM vishwabharati_college_guest_lecture_reg ORDER BY id DESC`);
    res.render("admin/vishwabharati_guest_lecture_reg_list.ejs", { "vishwabharati_guest_lecture_reg": data });
});

router.get("/industrial_training_list", checkAdmin, async function (req, res) {
    var data = await exe(`SELECT * FROM industrial_training`);
    res.render("admin/industrial_training_list.ejs", { "industrial_training": data });
});

router.get("/registrations_for_college_internships", checkAdmin, async function (req, res) {
    var data = await exe(`SELECT * FROM college_internships_registration`);
    var obj = { "internships": data }
    res.render("admin/registrations_for_college_internships.ejs", obj);
});

router.get("/delete_college_internship_registration/:id", checkAdmin, async function (req, res) {
    var id = req.params.id;
    var data = await exe(`DELETE FROM college_internships_registration WHERE internships_registrations_id = '${id}'`);
    res.redirect("/admin/registrations_for_college_internships");
});

router.get("/advance-internship-program", async function (req, res) {
    var data = await exe(`SELECT * FROM registrations ORDER BY created_at DESC`);
    res.render("admin/internship-program-list.ejs", { "intern_reg": data });
});

router.get("/feedbacks-list", async function (req, res) {
    var data = await exe(`SELECT * FROM feedbacks ORDER BY created_at DESC`);
    res.render("admin/feedbacks-list.ejs", { "feedbacks": data });
});

router.post("/update-internship-status", async (req, res) => {
    const { id, payment_status, college_name, hod_name } = req.body;

    await exe(`
    UPDATE registrations
    SET payment_status = ?, college_name = ?, hod_name = ?
    WHERE id = ?
  `, [payment_status, college_name, hod_name, id]);

    res.json({ success: true });
});

router.get("/internship-registration-2026", async function (req, res) {
    var intern_reg = await exe(`SELECT * FROM advanced_internship_registrations ORDER BY created_at DESC`);
    res.render("admin/internship-registration-2026.ejs", { "intern_reg": intern_reg });
});

router.post("/update-internship-payment-status", async (req, res) => {
    try {
        const { id, payment_status } = req.body;

        await exe(
            "UPDATE advanced_internship_registrations SET payment_status=? WHERE id=?",
            [payment_status, id]
        );

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
});

router.get("/resume-session-registrations", checkAdmin, async function (req, res) {

    let registrations = await exe(`
        SELECT * FROM resume_session_registrations 
        ORDER BY id DESC
    `);

    res.render("admin/resume_session_registrations.ejs", { registrations });
});

router.get("/karjat-dp-cloud-registrations", checkAdmin, async function (req, res) {

    let registrations = await exe(`
        SELECT * FROM karjat_dp_cloud_reg
        ORDER BY id DESC
    `);

    res.render("admin/karjat_dp_cloud_registrations.ejs", { registrations });
});

router.get("/adsul_interview_drive_reg", checkAdmin, async function (req, res) {

    let registrations = await exe(`
        SELECT * FROM adsul_interview_drive_reg
        ORDER BY id DESC
    `);

    res.render("admin/adsul_interview_drive_reg.ejs", { registrations });
});

router.get("/adsul-itr-registrations", checkAdmin, async function (req, res) {

    let registrations = await exe(`
        SELECT * FROM training_registrations
        ORDER BY id DESC
    `);

    res.render("admin/adsul-itr-registrations.ejs", { registrations });
});

router.get("/adsul_internship_registrations", checkAdmin, async function (req, res) {

    let registrations = await exe(`
        SELECT * FROM adsul_internship_registrations
        ORDER BY id DESC
    `);

    res.render("admin/adsul_internship_registrations.ejs", { registrations });
});

router.get("/scsmcoe_internship_reg", checkAdmin, async function (req, res) {

    let registrations = await exe(`
        SELECT * FROM scsmcoe_internship_reg
        ORDER BY id DESC
    `);

    res.render("admin/scsmcoe_internship_reg.ejs", { registrations });
});

router.get("/service_list", checkAdmin, async function (req, res) {

    let services = await exe(`
        SELECT *
        FROM services
        ORDER BY service_id DESC
    `);

    res.render("admin/service_list.ejs", {
        services: services
    });
});


router.get("/delete_service/:id", checkAdmin, async function (req, res) {

    let id = req.params.id;

    await exe(`
        DELETE FROM services
        WHERE service_id = ?
    `, [id]);

    res.redirect("/admin/service_list");

});

router.get("/edit_service/:id", checkAdmin, async function (req, res) {

    let id = req.params.id;

    let data = await exe(`
        SELECT *
        FROM services
        WHERE service_id = ?
    `, [id]);

    res.render("admin/edit_service.ejs", {
        service: data[0]
    });

});


router.post("/update_service", checkAdmin, async function (req, res) {
    try {
        let d = req.body;

        if (req.files && req.files.service_image) {
            // 1. Create an exact timestamp prefix to avoid filename matching bugs
            const uniquePrefix = Date.now() + "-";
            let service_image = uniquePrefix + req.files.service_image.name.replace(/\s+/g, '_');

            // 2. Move file directly into your website's public images directory
            await req.files.service_image.mv("public/user_assets/images/" + service_image);

            // 3. Update all data fields INCLUDING the new image string name
            await exe(`
                UPDATE services
                SET
                service_title=?, service_slug=?, service_image=?, cta_title=?,
                point1=?, point2=?, point3=?, point4=?, service_description=?,
                seo_title=?, meta_description=?, meta_keywords=?, seo_content=?,
                faq_question1=?, faq_answer1=?, faq_question2=?, faq_answer2=?,
                faq_question3=?, faq_answer3=?, faq_question4=?, faq_answer4=?,
                faq_question5=?, faq_answer5=?, faq_question6=?, faq_answer6=?,
                faq_question7=?, faq_answer7=?, faq_question8=?, faq_answer8=?,
                faq_question9=?, faq_answer9=?, faq_question10=?, faq_answer10=?,
                status=?
                WHERE service_id=?
            `, [
                d.service_title, d.service_slug, service_image, d.cta_title,
                d.point1, d.point2, d.point3, d.point4, d.service_description,
                d.seo_title, d.meta_description, d.meta_keywords, d.seo_content,
                d.faq_question1, d.faq_answer1, d.faq_question2, d.faq_answer2,
                d.faq_question3, d.faq_answer3, d.faq_question4, d.faq_answer4,
                d.faq_question5, d.faq_answer5, d.faq_question6, d.faq_answer6,
                d.faq_question7, d.faq_answer7, d.faq_question8, d.faq_answer8,
                d.faq_question9, d.faq_answer9, d.faq_question10, d.faq_answer10,
                d.status, d.service_id
            ]);

        } else {
            // 4. Fallback: Update text data BUT preserve the existing image name if empty
            await exe(`
                UPDATE services
                SET
                service_title=?, service_slug=?, cta_title=?,
                point1=?, point2=?, point3=?, point4=?, service_description=?,
                seo_title=?, meta_description=?, meta_keywords=?, seo_content=?,
                faq_question1=?, faq_answer1=?, faq_question2=?, faq_answer2=?,
                faq_question3=?, faq_answer3=?, faq_question4=?, faq_answer4=?,
                faq_question5=?, faq_answer5=?, faq_question6=?, faq_answer6=?,
                faq_question7=?, faq_answer7=?, faq_question8=?, faq_answer8=?,
                faq_question9=?, faq_answer9=?, faq_question10=?, faq_answer10=?,
                status=?
                WHERE service_id=?
            `, [
                d.service_title, d.service_slug, d.cta_title,
                d.point1, d.point2, d.point3, d.point4, d.service_description,
                d.seo_title, d.meta_description, d.meta_keywords, d.seo_content,
                d.faq_question1, d.faq_answer1, d.faq_question2, d.faq_answer2,
                d.faq_question3, d.faq_answer3, d.faq_question4, d.faq_answer4,
                d.faq_question5, d.faq_answer5, d.faq_question6, d.faq_answer6,
                d.faq_question7, d.faq_answer7, d.faq_question8, d.faq_answer8,
                d.faq_question9, d.faq_answer9, d.faq_question10, d.faq_answer10,
                d.status, d.service_id
            ]);
        }

        res.redirect("/admin/service_list");

    } catch (err) {
        console.error("Update failed:", err);
        res.status(500).send(err);
    }
});


router.get("/program_registrations",checkAdmin, async function (req, res) {

    var sql = `
        SELECT *
        FROM program_registration_submissions
        ORDER BY id DESC
    `;

    var registrations = await exe(sql);

    res.render("admin/program_registrations.ejs", {
        registrations: registrations
    });

});

module.exports = router;