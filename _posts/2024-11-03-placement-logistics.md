---
layout: post
title: Placement Logistics Prep?
tags: Campus Placement IIT
style: 
color: secondary
description: A blog post to help coordinators prep for the logistics side of the endgame
---

<style>
/* Default font size for readability */
body {
    font-size: 18px;
    line-height: 1.6;
    padding: 0 15px;
}

/* Adjust font sizes for mobile screens */
@media (max-width: 768px) {
    body {
        font-size: 16px;
        line-height: 1.5;
    }
    h1 {
        font-size: 1.8em;
    }
    h2 {
        font-size: 1.6em;
    }
    h3 {
        font-size: 1.4em;
    }
}

/* Style adjustments for the Mermaid chart */
.mermaid {
    font-size: 14px;
    overflow-x: auto;
    max-width: 100%;
}

@media (max-width: 480px) {
    .mermaid {
        font-size: 12px;
    }
}
</style>

<div class=mermaid>
graph TD
    %% Main Phase Categories
    Start([Begin Process]) --> Phase1[Phase 1: Pre-Arrival]
    Start --> Phase2[Phase 2: Visit Preparation]
    Start --> Phase3[Phase 3: Interview Setup]
    Start --> Phase4[Phase 4: Post-Visit]

    %% Phase 1: Pre-Arrival Tasks
    Phase1 --> Sched1[Check Internal Calendar]
    Sched1 --> Sched2[Draft Formal Invitation]
    Sched2 --> Sched3[Coordinate Dates with Google]
    Sched3 --> Sched4[Finalize Schedule]

    Phase1 --> Vol1[Create Volunteer Database]
    Vol1 --> Vol2[Select Company POC]
    Vol2 --> Vol3[Brief POC on Responsibilities]
    Vol3 --> Vol4[Create POC ID Cards]

    Phase1 --> Trans1[Contact HOCCCD for Permissions]
    Trans1 --> Trans2[Get Cab Usage Approval]
    Trans2 --> Trans3[Get Scooty Usage Approval]
    Trans3 --> Trans4[Book Required Cabs]

    Phase1 --> Guest1[Count Required Rooms]
    Guest1 --> Guest2[Get Authority Permission]
    Guest2 --> Guest3[Book Guesthouse]
    Guest3 --> Guest4[Prepare Guest Kits]

    %% Phase 2: Visit Preparation
    Phase2 --> Orient1[Schedule Orientation Session]
    Orient1 --> Orient2[Conduct Volunteer Training]
    Orient2 --> Orient3[Distribute Contact Directory]
    Orient3 --> Orient4[Assign Emergency Roles]

    Phase2 --> Log1[Book E-Rickshaws]
    Log1 --> Log2[Print Campus Maps]
    Log2 --> Log3[Create Direction Signs]
    Log3 --> Log4[Prepare Welcome Kits]

    Phase2 --> Merch1[Design Team Merchandise]
    Merch1 --> Merch2[Get Merch Approvals]
    Merch2 --> Merch3[Order Team Identifiers]

    %% Phase 3: Interview Setup
    Phase3 --> Room1[Get Hostel Usage Permit]
    Room1 --> Room2[Verify Room Availability]
    Room2 --> Room3[Check Infrastructure]
    Room3 --> Room4[Plan Barricading]

    Room3 --> Infra1[Schedule Paint Touch-ups]
    Infra1 --> Infra2[Check Electrical Systems]
    Infra2 --> Infra3[Arrange Furniture]
    Infra3 --> Infra4[Install WiFi Routers]

    Phase3 --> Med1[Contact Medical Center]
    Med1 --> Med2[Setup First Aid Stations]
    Med2 --> Med3[Brief Emergency Protocol]

    Phase3 --> Control1[Get Control Room Permission]
    Control1 --> Control2[Setup Computers]
    Control2 --> Control3[Prepare Master Sheets]
    Control3 --> Control4[Create Availability Tracker]

    Phase3 --> Ref1[Survey Vendor Options]
    Ref1 --> Ref2[Estimate Headcount]
    Ref2 --> Ref3[Negotiate with Canteens]
    Ref3 --> Ref4[Plan Refreshment Schedule]

    %% Phase 4: Post-Visit
    Phase4 --> Post1[Design Feedback Forms]
    Post1 --> Post2[Collect Interview Feedback]
    Post2 --> Post3[Document Process]

    Phase4 --> Gift1[Design Placement Diaries]
    Gift1 --> Gift2[Get Diary Approvals]
    Gift2 --> Gift3[Print Diaries]
    Gift3 --> Gift4[Prepare Thank You Notes]

    %% Critical Dependencies
    Sched4 --> Orient1
    Vol4 --> Orient1
    Room4 --> Orient2
    Control4 --> Orient2

    %% Day-of Dependencies
    Orient4 & Log4 & Room4 & Control4 --> Ready{Final Verification}
    Ready --> Execute([Begin Company Visit])

    %% Styling
    classDef phase fill:#f9f,stroke:#333,stroke-width:2px
    classDef critical fill:#f66,stroke:#333,stroke-width:2px
    classDef check fill:#bbf,stroke:#333,stroke-width:2px
    class Phase1,Phase2,Phase3,Phase4 phase
    class Ready check
    class Execute,Start critical
</div>
