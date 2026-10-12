"""
build_portfolio.py  -  builds "Ravi: The Series", a streaming-style portfolio, as ONE html file.

How it works
  1. Your career content lives in the DATA dictionary below. Edit text here, not in the HTML.
  2. portfolio_template.html holds the design: layout, colours, animation and JavaScript.
  3. This script puts DATA + your photo + your email into the template and writes ravi_series.html,
     then opens it in your browser.

Uses only Python's standard library, so there is nothing to pip install.

Run it (Command Prompt, inside this folder):
    python build_portfolio.py

Keep these three files in the same folder:
    build_portfolio.py   portfolio_template.html   ravi_photo.jpg

Short keys used in DATA
    t = title          log = one-line summary      syn = synopsis paragraph   bul = bullet points
    nums = [number, label] pairs shown as "Key numbers"   tags = tools used   link = [button text, url]
    c1 / c2 = poster colours (CSS colour tokens)   g = poster icon (bars, truck, nodes, grid, pulse,
    shovel, podium, radar, spark, letter, seal, person, path, star, doc, helmet, chips, contour, flow)
    status = 'live' (green label) or 'soon' (amber label)   see = id of the related season/original
    Seasons: n = season number, when = dates, eps = [episode title, episode text] pairs
    Skills: each item is [skill name, [ids where it shows up], optional 'Learning' tag]
"""
import base64
import json
import webbrowser
from pathlib import Path

HERE = Path(__file__).resolve().parent
TEMPLATE = HERE / "portfolio_template.html"
PHOTO = HERE / "ravi_photo.jpg"          # .jpg or .png; leave it out to show the RSD monogram
OUTPUT = HERE / "ravi_series.html"
PUBLIC = True   # True hides internal company figures (e.g. the Rs 20 Cr benefit) so the page is safe to put online
EMAIL = "ravirockzzz28@gmail.com"

DATA = {
    'originals': [
        {
            'id': 'o-fms',
            't': 'FMS Toolkit',
            'year': '2026',
            'status': 'live',
            'statusText': 'In daily use',
            'genre': 'Python · Excel · HTML',
            'c1': '--p-steel',
            'c2': '--p-slate',
            'g': 'bars',
            'log': 'Two mines, one offline file. Daily FMS vs MIS compliance for Quarry AB and Quarry SE.',
            'syn': 'Python pipelines turn Wenco FMS exports into styled Excel workbooks, HTML dashboards and ready-to-send Outlook mails. The whole toolkit runs offline as a single HTML file, including the FMS & network performance summary for QAB.',
            'bul': ['Analysed April to July 2026 for both mines: QSE held steady near 97.8 m³/hr while QAB fell from 94.2 to 75.6 m³/hr', 'Showed Empty Stop as the largest idle category at both mines', 'Caught mislabelled source files, including a QSE availability file that carried QAB fleet data'],
            'nums': [
                ['2', 'mines on one screen'],
                ['4', 'months analysed'],
                ['−19.7%', 'QAB productivity slide flagged'],
            ],
            'tags': ['Python', 'pandas', 'Excel', 'HTML', 'Outlook', 'Wenco FMS'],
        },
        {
            'id': 'o-idle',
            't': 'The Idle Hunt',
            'year': '2026',
            'status': 'live',
            'statusText': 'Six Sigma project',
            'genre': 'DMAIC · Pareto',
            'c1': '--ember',
            'c2': '--p-ore',
            'g': 'truck',
            'log': 'Cutting dumper idle time at Quarry AB by 20%, using DMAIC on every trip the fleet logged.',
            'syn': 'An ASPIRE Six Sigma project (Wave 46). The charter, Measure-phase workbook and review decks are complete. The analysis covered 75,905 trips from 24 dumpers across 315 shifts.',
            'bul': ['Baseline 7.60 minutes of idle per cycle, target 6.10', 'Pareto vital few: Empty Stop 66%, queue at loading unit 13%, waiting at dump 12%', 'Kept three dumpers with FMS logging faults out of the baseline so the numbers stay honest', 'Registered benefit of about ₹20 Cr recurring, at zero budget'],
            'nums': [
                ['75,905', 'trips analysed'],
                ['7.60 → 6.10', 'min idle per cycle'],
                ['₹20 Cr', 'registered recurring benefit'],
            ],
            'tags': ['DMAIC', 'Six Sigma', 'Pareto', 'Excel', 'Wenco FMS'],
        },
        {
            'id': 'o-vsic',
            't': 'Virtual Shift In-Charge',
            'year': '2026',
            'status': 'live',
            'statusText': 'In development',
            'genre': 'AI agent · Wenco events',
            'c1': '--p-violet',
            'c2': '--p-indigo',
            'g': 'nodes',
            'log': 'An AI shift in-charge that watches the fleet the way a supervisor would.',
            'syn': 'Co-developed with Anand Pandey as part of the Digital Crew RM programme at iRMSC. I wrote the charter in plain English and took it through five versions, then built the event triage the AI learns from.',
            'bul': ['Charter at version 5', 'Wenco event-monitor triage: 52 event types kept for the AI to learn, the rest scrapped as noise', 'Safety-critical events always kept through four hard overrides', 'Packaged the triage logic as a reusable skill for the team'],
            'nums': [
                ['v5', 'charter'],
                ['52', 'event types kept'],
                ['4', 'safety overrides'],
            ],
            'tags': ['AI agents', 'Wenco events', 'Claude skills', 'Charter writing'],
        },
        {
            'id': 'o-fleet',
            't': 'Fleet Manager · Shift View',
            'year': '2026',
            'status': 'live',
            'statusText': 'Prototype live',
            'genre': 'Dashboard design',
            'c1': '--p-teal',
            'c2': '--p-slate',
            'g': 'grid',
            'log': 'The whole shift on one control-room screen.',
            'syn': 'A mine control-room dashboard prototype built in Google AI Studio and again in Lovable, on dummy data. It grew into a single West Bokaro view that follows run-of-mine coal from the face to the hopper and on to the washery for both mines.',
            'bul': ['Two working builds: Google AI Studio and Lovable', 'One universal West Bokaro view covering QAB and QSE', 'Being taken to the IT team for hosting on the company server'],
            'nums': [['2', 'builds'], ['1', 'screen for both mines']],
            'tags': ['Google AI Studio', 'Lovable', 'Dashboard UX', 'Control room'],
            'link': ['Open the prototype', 'https://fleet-manager-shift-view.ai.studio'],
        },
        {
            'id': 'o-pit',
            't': 'PitPulse',
            'year': '2026',
            'status': 'live',
            'statusText': 'Live site',
            'genre': 'Web · Product pitch',
            'c1': '--p-ore',
            'c2': '--p-copper',
            'g': 'pulse',
            'log': 'A website that pitches fleet management systems to big mining companies.',
            'syn': "Designed and published with Lovable on my own domain. It explains, in a mine manager's language, what an FMS changes on a shift and why it pays back.",
            'bul': ['Built end to end with Lovable', 'Published on a personal domain and shared with mining contacts'],
            'nums': [['1', 'live site']],
            'tags': ['Lovable', 'Web', 'Product marketing'],
            'link': ['Visit pitpulsemining.live', 'https://pitpulsemining.live'],
        },
        {
            'id': 'o-sip',
            't': 'Shovel Push',
            'year': 'FY27',
            'status': 'soon',
            'statusText': 'Running to Mar 2027',
            'genre': 'Improvement project',
            'c1': '--p-amber',
            'c2': '--p-copper',
            'g': 'shovel',
            'log': 'Lifting QAB EX2500 shovel productivity by 29%, from 327 to 423 m³/hr.',
            'syn': 'A registered ASPIRE improvement project framed around sustaining the FY27 raw coal production target. Sister projects cover the EX1200 shovels and Quarry SE.',
            'bul': ['Baseline 327 m³/hr, target 423 m³/hr by 31 March 2027', 'Separate projects for QAB EX2500, QAB EX1200 and QSE EX2500', 'Dumper wait-at-dump is lined up next'],
            'nums': [
                ['327 → 423', 'm³/hr'],
                ['+29%', 'target lift'],
                ['3', 'sister projects'],
            ],
            'tags': ['Shovel productivity', 'ASPIRE', 'KRA'],
        },
        {
            'id': 'o-rd',
            't': 'Operator Scoreboard',
            'year': '2026',
            'status': 'live',
            'statusText': 'Monthly release',
            'genre': 'Excel · Outlook',
            'c1': '--p-moss',
            'c2': '--p-slate',
            'g': 'podium',
            'log': 'A monthly notice-board report that ranks 100T dumper operators fairly.',
            'syn': "Built for the Head of Mining Operations at QAB. Each operator appears under his shift in-charge's crew. Breakdown shifts are detected from trip data, so nobody is judged on a dumper that was down.",
            'bul': ['Top 10 and bottom 10 on total trips across coal, mixed coal and overburden', 'Worst 5 on canteen breaks longer than 30 minutes', 'Worst 5 on late first loads and early last loads'],
            'nums': [['3', 'trends per month'], ['100T', 'fleet only']],
            'tags': ['Excel', 'Outlook', 'Wenco FMS', 'People metrics'],
        },
        {
            'id': 'o-bench',
            't': 'Benchmark Watch',
            'year': '2026',
            'status': 'soon',
            'statusText': 'Premieres 12 Oct',
            'genre': 'AI research agent',
            'c1': '--p-indigo',
            'c2': '--p-violet',
            'g': 'radar',
            'log': 'A weekly AI watch on how steel and mining majors use digital and AI.',
            'syn': 'Runs inside Claude as a skill with a Monday schedule. It reads new announcements from peers such as JSW, Coal India, SAIL and ArcelorMittal, scores them against 16 themes and emails a short digest with what Tata Steel could do better.',
            'bul': ['Skill plus a weekly scheduled run, no code to maintain', 'Digest lands in the inbox every Monday'],
            'nums': [['16', 'benchmark themes'], ['Weekly', 'cadence']],
            'tags': ['Claude skills', 'Scheduled agents', 'Research'],
        },
        {
            'id': 'o-ehack',
            't': 'eHack Entries',
            'year': '2026',
            'status': 'live',
            'statusText': 'Submitted',
            'genre': 'Innovation challenge',
            'c1': '--p-copper',
            'c2': '--p-ore',
            'g': 'spark',
            'log': 'Two entries for Tata eHack innovation challenges.',
            'syn': 'Engineering concepts for two plant problems, written up as innovation challenge submissions.',
            'bul': ['Automated scotching for torpedo ladles, led by a bogie-mounted gravity-drop scotch arm', 'Automated covering for coal heaps'],
            'nums': [['2', 'entries']],
            'tags': ['Innovation', 'Mechanical design'],
        },
        {
            'id': 'o-shikhi',
            't': 'Shikhi',
            'year': '2026',
            'status': 'live',
            'statusText': 'Side project',
            'genre': 'Offline apps · EdTech',
            'c1': '--p-rose',
            'c2': '--p-violet',
            'g': 'letter',
            'log': 'Offline language-learning apps with Bengali explanations.',
            'syn': 'Built for a family member learning English and Hindi: gamified practice apps and a 30-day Bengali-to-Hindi course, each a single HTML file that works offline on a phone and travels over WhatsApp.',
            'bul': ['English app, Hindi reference app and a 30-day day-by-day course', 'Bengali explanations throughout, with a learning log and fresh exercises each time'],
            'nums': [['3', 'apps'], ['30', 'day course']],
            'tags': ['HTML', 'Offline apps', 'EdTech'],
        },
    ],
    'seasons': [
        {
            'id': 's01',
            'n': '01',
            't': 'The Foundation',
            'when': '2014 – 2018',
            'org': 'Adarsha College of Engineering',
            'place': 'Angul, Odisha',
            'role': 'B.Tech, Mining Engineering',
            'syn': 'Four years of mining engineering. The season that sets up everything that follows.',
            'eps': [
                ['B.Tech, Mining Engineering', 'Adarsha College of Engineering, Angul, Odisha. Graduated 2018.'],
            ],
        },
        {
            'id': 's02',
            'n': '02',
            't': 'Underground Pilot',
            'when': 'Dec 2018 – Dec 2019',
            'org': 'Eastern Coalfields Limited',
            'place': 'MIC Jhanjra, Durgapur',
            'role': 'Post Graduate Practical Trainee',
            'syn': 'A year at Jhanjra, a mechanised underground mine with longwalls and continuous miners, close to home in Durgapur.',
            'eps': [
                ['Longwall & continuous miner', 'Hands-on training in continuous-miner and longwall technology with powered roof supports.'],
                ['Depillaring', 'Caving and stowing methods underground.'],
                ['Safety systems', 'Safety management systems, SOPs and codes of practice.'],
                ['Second Class ticket', "Second Class Mine Manager's Certificate (Unrestricted, Coal) and Gas Testing Certificate, 2019."],
            ],
        },
        {
            'id': 's03',
            'n': '03',
            't': 'Shift In-Charge',
            'when': 'Mar 2022 – May 2023',
            'org': 'Nilkanth Infra Mining Ltd',
            'place': 'Suliyari Coal Mines (OCP), Singrauli',
            'role': 'Assistant Manager – Shift In-Charge',
            'syn': 'First full command of a shift in an opencast coal mine.',
            'eps': [
                ['Full shift control', 'Fleet, haul-road maintenance, OB and coal, dump yard, faces and sections.'],
                ['2.5 MT delivered', 'Met the FY2022–23 coal target of 2.5 million tonnes.'],
                ['Thin seams', 'Thin-seam mining from 0.15 to 0.5 m.'],
                ['First aid', 'First Aid Certificate, 2022.'],
            ],
        },
        {
            'id': 's04',
            'n': '04',
            't': 'Peak Output',
            'when': 'May 2023 – Sep 2023',
            'org': 'Dilip Buildcon Ltd',
            'place': 'Siarmal Coal Mines (OCP), Jharsuguda',
            'role': 'Assistant Manager – Coal Operations',
            'syn': 'Coal operations in-charge in a mechanised mine cut by surface miners.',
            'eps': [
                ['Surface miner cutting', 'In charge of coal in a mechanised HEMM shovel–dumper mine using surface-miner cutting.'],
                ['21,500 t in a day', 'Peak output of 21,500 tonnes per day.'],
                ['0.52 MT in a month', 'Monthly peak of 0.52 million tonnes within limited resources.'],
            ],
        },
        {
            'id': 's05',
            'n': '05',
            't': 'Going Underground',
            'when': 'Sep 2023 – Sep 2024',
            'org': 'JSW Steel Ltd',
            'place': 'Parbatpur Central Coal Mines, Bokaro',
            'role': 'Assistant Manager – Operations',
            'syn': 'Back underground, in a degree III gassy coal mine being brought back to life.',
            'eps': [
                ['Degree III mine', 'Operations in a 0.7 MTPA underground mine; statutory compliances and permissions for re-opening.'],
                ['Water and air', 'Supervised centrifugal and pneumatic pumping and dewatering; developed ventilation strategies.'],
                ['Washery & CHP', 'Helped commission a 2 MTPA coal washery and coal handling plant.'],
                ['First Class ticket', "First Class Mine Manager's Certificate (Restricted, Coal), 2024."],
            ],
        },
        {
            'id': 's06',
            'n': '06',
            't': 'West Bokaro',
            'when': 'Sep 2024 – Sep 2025',
            'org': 'Tata Steel Ltd',
            'place': 'West Bokaro Division, Ramgarh',
            'role': 'Assistant Manager – Mining (Shift Operations)',
            'syn': 'Joining Tata Steel at the face: big fleets, deep-hole blasting and a 65–70 person shift.',
            'eps': [
                ['Big shifts', 'Ran shifts of a highly mechanised opencast mine: shovel–dumper, deep-hole drilling and blasting, 65–70 people.'],
                ['FMS & GPS control', 'Real-time control through FMS and GPS; analysed delays and idle time.'],
                ['Safety analytics', 'EnsafeNxt hazards, line walks, job cycle checks, near-miss reporting and critical safety measures.'],
                ['Kaizen', 'Process improvements logged through the in-house QUIKS system.'],
            ],
        },
        {
            'id': 's07',
            'n': '07',
            't': 'The Data Layer',
            'when': 'Sep 2025 – Present',
            'org': 'Tata Steel Ltd',
            'place': 'iRMSC, Jamshedpur',
            'role': 'Assistant Manager – iRMSC',
            'syn': 'From the pit to the control room. Second-level supervision of two mines, more than 100 km away, through their data.',
            'eps': [
                ['Two mines, one screen', 'Remote supervision of Quarry AB and Quarry SE through the Wenco Fleet Management System.'],
                ['KPIs against plan', 'Monthly KPI dashboards and shovel and overburden productivity benchmarked against the annual business plan.'],
                ['GM & VP reviews', 'Operational review decks for GM and VP RM reviews, with trends, root causes and actions.'],
                ['Data you can trust', 'FMS data assurance and FMS vs MIS reconciliation; issues tracked to closure with field, IT and survey teams.'],
                ['Digital Crew RM', 'AI tools for the iRMSC Digital Crew: Virtual Shift In-Charge, event triage and a benchmarking agent.'],
            ],
        },
        {
            'id': 's08',
            'n': '08',
            't': "What's Next",
            'when': '2026 – 2027',
            'org': 'Coming soon',
            'place': 'Digital mining & AI',
            'role': 'Data & analytics',
            'syn': 'The next season is being written now: deeper data skills, built on six seasons of mine floor context.',
            'coming': True,
            'eps': [
                ['Bench Cut', 'A 91-day plan through Python, pandas, SQL and Power BI (PL-300 track), using real FMS data.'],
                ['Git & GitHub', 'Learning version control from zero, October 2026.'],
                ['School of AI', 'Tata Steel SOAI sessions and an action learning project on shovel and dumper productivity.'],
                ['The goal', 'Data and analytics roles in digital mining and AI, in India.'],
            ],
        },
    ],
    'moments': [
        {
            'id': 'm-first',
            'k': 'Statutory ticket',
            't': '1st Class',
            's': 'Mine Manager · Coal',
            'f': 'Restricted · 2024',
            'c1': '--p-amber',
            'c2': '--p-copper',
            'log': "First Class Mine Manager's Certificate of Competency (Restricted), Coal, 2024.",
            'syn': "Earned while working underground at JSW Steel's Parbatpur Central mine. It built on the Second Class (Unrestricted) certificate from 2019.",
            'see': 's05',
        },
        {
            'id': 'm-gb',
            'k': 'Six Sigma',
            't': 'Green Belt',
            's': 'Certified',
            'f': 'Plus Yellow Belt',
            'c1': '--p-moss',
            'c2': '--p-slate',
            'log': 'Six Sigma Green Belt certified, after the Yellow Belt.',
            'syn': 'Put to work straight away on the Idle Hunt, a DMAIC project on dumper idle time at Quarry AB.',
            'see': 'o-idle',
        },
        {
            'id': 'm-peak',
            'k': 'Peak output',
            't': '21,500 t/day',
            's': 'Siarmal OCP',
            'f': '0.52 MT in a month',
            'c1': '--p-ore',
            'c2': '--p-copper',
            'log': 'A peak of 21,500 tonnes of coal in a day at Siarmal Coal Mines.',
            'syn': 'As coal operations in-charge at Dilip Buildcon, with surface-miner cutting and limited resources. The same season hit 0.52 MT in a month.',
            'see': 's04',
        },
        {
            'id': 'm-target',
            'k': 'Annual target',
            't': '2.5 MT coal',
            's': 'Suliyari OCP',
            'f': 'FY2022–23 delivered',
            'c1': '--p-steel',
            'c2': '--p-slate',
            'log': 'Delivered the FY2022–23 coal target of 2.5 million tonnes at Suliyari.',
            'syn': 'As shift in-charge at Nilkanth Infra Mining, across fleet, haul roads, OB and coal, including thin seams of 0.15 to 0.5 m.',
            'see': 's03',
        },
        {
            'id': 'm-vp',
            'k': 'Leadership review',
            't': 'VP RM deck',
            's': 'Shift KPI story',
            'f': 'June 2026',
            'c1': '--p-violet',
            'c2': '--p-indigo',
            'log': 'Built the 14-slide Shift KPI and Fleet Manager deck for a VP Raw Materials review, June 2026.',
            'syn': 'Also built an 8-slide GM review deck on the FMS strengthening journey, and the vendor escalation deck with its issue log.',
            'see': 's07',
        },
        {
            'id': 'm-tcs',
            'k': 'Delegation',
            't': 'TCS America',
            's': 'Concept note & deck',
            'f': 'Well received by leadership',
            'c1': '--p-teal',
            'c2': '--p-steel',
            'log': 'Prepared the concept note and presentation for a TCS America delegation visit.',
            'syn': 'The material drew positive feedback from senior leadership.',
            'see': 's07',
        },
        {
            'id': 'm-ehack',
            'k': 'Innovation',
            't': '2 × eHack',
            's': 'Tata eHack entries',
            'f': 'Ladles · Coal heaps',
            'c1': '--p-copper',
            'c2': '--p-ore',
            'log': 'Two entries in Tata eHack innovation challenges.',
            'syn': 'Automated scotching for torpedo ladles, and automated covering for coal heaps.',
            'see': 'o-ehack',
        },
    ],
    'certs': [
        {
            'id': 'c-first',
            'iss': 'DGMS · Statutory',
            't': "First Class Mine Manager's Certificate",
            'm': 'Coal · Restricted · 2024',
            'st': 'Certified',
            'see': 's05',
        },
        {
            'id': 'c-second',
            'iss': 'DGMS · Statutory',
            't': "Second Class Mine Manager's Certificate",
            'm': 'Coal · Unrestricted · 2019',
            'st': 'Certified',
            'see': 's02',
        },
        {
            'id': 'c-gb',
            'iss': 'Six Sigma',
            't': 'Green Belt',
            'm': 'Lean & DMAIC',
            'st': 'Certified',
            'see': 'o-idle',
        },
        {
            'id': 'c-yb',
            'iss': 'Six Sigma',
            't': 'Yellow Belt',
            'm': 'Lean foundations',
            'st': 'Certified',
            'see': 'o-idle',
        },
        {
            'id': 'c-gas',
            'iss': 'Safety',
            't': 'Gas Testing Certificate',
            'm': '2019',
            'st': 'Certified',
            'see': 's02',
        },
        {
            'id': 'c-aid',
            'iss': 'Safety',
            't': 'First Aid Certificate',
            'm': '2022',
            'st': 'Certified',
            'see': 's03',
        },
        {
            'id': 'c-soai',
            'iss': 'Tata Steel · SOAI',
            't': 'School of Artificial Intelligence',
            'm': 'Action learning project on shovel & dumper productivity',
            'st': 'In training',
            'train': True,
            'see': 's08',
        },
        {
            'id': 'c-tbem',
            'iss': 'Tata Steel',
            't': 'TBEM & DATOM 2026',
            'm': 'Learning sessions, all categories',
            'st': 'Completed sessions',
            'train': True,
            'see': 's07',
        },
        {
            'id': 'c-bench',
            'iss': 'Self-directed',
            't': 'Bench Cut: Python, SQL, Power BI',
            'm': '91-day plan · PL-300 track',
            'st': 'In training',
            'train': True,
            'see': 's08',
        },
    ],
    'skills': [
        {
            'id': 'ops',
            't': 'Mining operations',
            's': 'Six seasons in coal, open pit and underground',
            'items': [
                [
                    'Shovel–dumper operations',
                    ['s03', 's04', 's06'],
                ],
                [
                    'Shift command, 65–70 people',
                    ['s03', 's06'],
                ],
                [
                    'Drilling & blasting',
                    ['s06'],
                ],
                [
                    'Underground degree III mining',
                    ['s02', 's05'],
                ],
                [
                    'Dewatering & ventilation',
                    ['s05'],
                ],
                [
                    'Safety systems & compliance',
                    ['s02', 's05', 's06', 'c-first'],
                ],
            ],
        },
        {
            'id': 'data',
            't': 'Data & analytics',
            's': 'Fleet data into decisions',
            'items': [
                [
                    'Wenco FMS',
                    ['s06', 's07', 'o-fms', 'o-vsic'],
                ],
                [
                    'Advanced Excel & Power Query',
                    ['s07', 'o-fms', 'o-rd'],
                ],
                [
                    'Tableau',
                    ['s07', 'o-rd'],
                ],
                [
                    'FMS vs MIS reconciliation',
                    ['o-fms', 's07'],
                ],
                [
                    'Python & pandas',
                    ['o-fms', 's08'],
                    'Learning',
                ],
                [
                    'SQL',
                    ['s08'],
                    'Learning',
                ],
                [
                    'Power BI (PL-300 track)',
                    ['s08', 'c-bench'],
                    'Learning',
                ],
            ],
        },
        {
            'id': 'ai',
            't': 'Digital & AI',
            's': 'Agents, dashboards and web builds',
            'items': [
                [
                    'Prompt design (RCTCF)',
                    ['c-soai', 'o-bench'],
                ],
                [
                    'Claude skills & agents',
                    ['o-bench', 'o-vsic'],
                ],
                [
                    'Google AI Studio',
                    ['o-fleet'],
                ],
                [
                    'Lovable web builds',
                    ['o-pit', 'o-fleet'],
                ],
                [
                    'Offline HTML apps',
                    ['o-fms', 'o-shikhi'],
                ],
                [
                    'Git & GitHub',
                    ['s08'],
                    'Learning',
                ],
            ],
        },
        {
            'id': 'lean',
            't': 'Improvement & leadership',
            's': 'Lean methods and review-ready stories',
            'items': [
                [
                    'Six Sigma DMAIC',
                    ['o-idle', 'c-gb'],
                ],
                [
                    'Pareto & root cause',
                    ['o-idle', 'o-fms'],
                ],
                [
                    'Kaizen (QUIKS)',
                    ['s06'],
                ],
                [
                    'GM & VP review decks',
                    ['s07', 'm-vp'],
                ],
                [
                    'Cross-functional closure',
                    ['s07'],
                ],
                [
                    'TBEM & DATOM readiness',
                    ['c-tbem'],
                ],
            ],
        },
    ],
    'picks': ['o-fms', 'o-idle', 'o-vsic', 'm-first', 'o-pit'],
    'sections': {
        'about': {
            't': 'About Me',
            's': 'The pilot · who, where, why',
            'c1': '--p-ore',
            'c2': '--p-slate',
            'g': 'person',
        },
        'journey': {
            't': 'My Journey',
            's': '8 seasons, 6 coal mines',
            'c1': '--p-violet',
            'c2': '--p-indigo',
            'g': 'path',
        },
        'originals': {
            't': 'Originals',
            's': '10 things I built',
            'c1': '--p-steel',
            'c2': '--p-teal',
            'g': 'grid',
        },
        'toppicks': {
            't': 'Top Picks',
            's': 'Start with these five',
            'c1': '--p-amber',
            'c2': '--p-copper',
            'g': 'podium',
        },
        'moments': {
            't': 'Top Moments',
            's': 'Output, tickets, reviews',
            'c1': '--p-copper',
            'c2': '--p-amber',
            'g': 'star',
        },
        'skills': {
            't': 'Skill Universe',
            's': 'Mining, data, AI, lean',
            'c1': '--p-teal',
            'c2': '--p-moss',
            'g': 'chips',
        },
        'certified': {
            't': 'Certified',
            's': '6 credentials + training',
            'c1': '--p-moss',
            'c2': '--p-slate',
            'g': 'seal',
        },
        'resume': {
            't': 'The Full Story',
            's': 'Every episode on one page',
            'c1': '--p-rose',
            'c2': '--p-ore',
            'g': 'doc',
        },
    },
    'profiles': {
        'ravi': {
            'n': 'Ravi',
            's': 'The full series, in order',
            'cut': 'The full series, in order.',
            'c1': '--ember',
            'c2': '--p-ore',
            'mono': 'R',
            'main': True,
        },
        'recruiter': {
            'n': 'Recruiter',
            's': 'Results, skills & resume first',
            'cut': 'Recruiter cut: results, skills and the one-page resume play first.',
            'c1': '--p-steel',
            'c2': '--p-indigo',
            'g': 'doc',
            'mono': 'Rc',
        },
        'mine': {
            'n': 'Mine Manager',
            's': 'Seasons at the coal face first',
            'cut': 'Operations cut: seasons at the coal face, output and statutory tickets play first.',
            'c1': '--p-amber',
            'c2': '--p-copper',
            'g': 'helmet',
            'mono': 'M',
        },
        'data': {
            'n': 'Data & AI',
            's': 'Builds, dashboards & tools first',
            'cut': 'Builder cut: dashboards, pipelines and AI projects play first.',
            'c1': '--p-teal',
            'c2': '--p-moss',
            'g': 'nodes',
            'mono': 'D',
        },
    },
    'order': {
        'ravi': ['continue', 'about', 'journey', 'originals', 'toppicks', 'moments', 'skills', 'certified', 'resume'],
        'recruiter': ['continue', 'moments', 'skills', 'resume', 'journey', 'originals', 'certified', 'toppicks', 'about'],
        'mine': ['continue', 'journey', 'moments', 'certified', 'originals', 'skills', 'about', 'toppicks', 'resume'],
        'data': ['continue', 'originals', 'toppicks', 'skills', 'moments', 'journey', 'certified', 'about', 'resume'],
    },
}


def photo_data_uri(path):
    """Read the photo and turn it into text the HTML can carry inside itself."""
    if not path.exists():
        print("  No photo found at", path.name, "- the page will show the RSD monogram.")
        return ""
    mime = "image/png" if path.suffix.lower() == ".png" else "image/jpeg"
    size_kb = path.stat().st_size / 1024
    if size_kb > 600:
        print(f"  Note: the photo is {size_kb:.0f} KB. Under 200 KB keeps the page quick on phones.")
    return f"data:{mime};base64," + base64.b64encode(path.read_bytes()).decode("ascii")


def check(data):
    """Catch the easy mistakes before building: missing links between ids, empty fields."""
    ids = {x["id"] for key in ("originals", "moments", "certs", "seasons") for x in data[key]}
    problems = []
    for item in data["picks"]:
        if item not in ids:
            problems.append(f"Top pick '{item}' does not match any id")
    for group in data["skills"]:
        for skill in group["items"]:
            for ref in skill[1]:
                if ref not in ids:
                    problems.append(f"Skill '{skill[0]}' points to unknown id '{ref}'")
    for key in ("moments", "certs"):
        for x in data[key]:
            if x.get("see") and x["see"] not in ids:
                problems.append(f"{x['id']} points to unknown id '{x['see']}'")
    for profile, order in data["order"].items():
        missing = set(data["sections"]) - set(order)
        if missing:
            problems.append(f"Profile '{profile}' is missing sections: {sorted(missing)}")
    return problems


def make_public(data):
    """Remove internal-only figures before the page goes on a public site."""
    for o in data["originals"]:
        o["bul"] = [x for x in o.get("bul", []) if "Cr" not in x]
        o["nums"] = [n for n in o.get("nums", []) if "Cr" not in n[0]]
        o["log"] = o["log"].replace(" Registered benefit of about \u20b920 Cr recurring, at zero budget.", "")


def build():
    if PUBLIC:
        make_public(DATA)
    if not TEMPLATE.exists():
        raise SystemExit(f"Can't find {TEMPLATE.name}. Keep it in the same folder as this script.")

    problems = check(DATA)
    if problems:
        print("Fix these in DATA first:")
        for p in problems:
            print("  -", p)
        raise SystemExit(1)

    html = TEMPLATE.read_text(encoding="utf-8")
    payload = json.dumps(DATA, ensure_ascii=False).replace("</", "<\\/")   # safe inside <script>
    html = (html.replace("__PORTFOLIO_DATA__", payload)
                .replace("__EMAIL__", EMAIL)
                .replace("__PHOTO__", photo_data_uri(PHOTO)))
    OUTPUT.write_text(html, encoding="utf-8")

    print("Built", OUTPUT.name, f"({OUTPUT.stat().st_size / 1024:.0f} KB)")
    print(f"  {len(DATA['originals'])} originals, {len(DATA['seasons'])} seasons, "
          f"{len(DATA['moments'])} moments, {len(DATA['certs'])} credentials")
    if "--open" in __import__("sys").argv: webbrowser.open(OUTPUT.as_uri())


if __name__ == "__main__":
    build()
