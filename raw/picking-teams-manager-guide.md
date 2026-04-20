# Picking Teams - Manager's Guide

> **Version:** 1.0
> **Last Updated:** 2026-02-25
> **Audience:** Managers

## Table of Contents

- [Overview](#overview)
- [Enabling picking teams](#enabling-picking-teams)
- [Setting up devices](#setting-up-devices)
- [Setting up teams](#setting-up-teams)
- [Assigning tickets to teams](#assigning-tickets-to-teams)
- [How pickers see their tickets](#how-pickers-see-their-tickets)
- [Daily workflow](#daily-workflow)
- [Troubleshooting](#troubleshooting)

---

## Overview

The Picking Teams feature lets you organize supermarket pickers into teams and assign tickets to those teams. Each team uses a shared tablet (picking device), and pickers only see tickets assigned to their team.

**Key concepts:**

- **Picking Device** - A physical tablet used by a picker. Each device is linked to one user at a time.
- **Picking Team** - A group of pickers working together. Each team is linked to one device.
- **Team assignment** - You assign supermarket tickets to teams. Pickers on that team see only those tickets.

**How the system resolves who belongs to which team:**

1. The picker logs in on a tablet
2. The system finds which **Picking Device** has that user
3. The system finds which **Picking Team** has that device
4. The picker sees only tickets assigned to that team

> **Note:** If a picker is not assigned to any device, or the device is not linked to a team, they see all tickets (same as before).

---

## Enabling picking teams

The feature is controlled by a toggle in Clesen Setup. When the toggle is off, all team-related columns, actions, and filters are hidden throughout the system.

### How to enable

1. Open **Clesen Setup** from the search bar.
2. Scroll to the **Picking** section.
3. Set **Activate Picking Teams** to on.
4. Close the page.

All team-related UI elements now appear on the Picking Dashboard, Supermarket Pick Tickets list, and ticket card pages.

### How to disable

1. Open **Clesen Setup**.
2. Set **Activate Picking Teams** to off.

> **Note:** Disabling the feature hides all team UI but does not delete existing team assignments. If you re-enable, previous assignments are still there.

---

## Setting up devices

Devices represent the physical tablets your pickers use. You create a device record for each tablet and assign the current user to it.

### How to manage devices

1. Open the **Picking Dashboard**.
2. In the **Setup** section, click **Picking Devices**.
3. For each physical tablet, create a record:

   - `Code` - A short name for the device (e.g., "TABLET-01", "TABLET-02")
   - `User ID` - The user currently logged into this device

4. Update the `User ID` field whenever a different picker takes over the tablet.

### Field reference

| Field     | Description                                | Required |
|-----------|--------------------------------------------|----------|
| `Code`    | Unique identifier for the device           | Yes      |
| `User ID` | The user currently assigned to this device | No       |

> **Tip:** Create all your device records once (e.g., TABLET-01 through TABLET-10). Then each shift, you only need to update the `User ID` field to reflect who is using which tablet.

---

## Setting up teams

Teams are lightweight groups that you can change at any time, even mid-day.

### How to manage teams

1. Open the **Picking Dashboard**.
2. In the **Setup** section, click **Picking Teams**.
3. For each team, create or update a record:

   - `Code` - A short team name (e.g., "TEAM-A", "TEAM-B")
   - `Members` - Free text describing who is on the team (informational only)
   - `Device Code` - The tablet assigned to this team

4. The page also shows two read-only columns to help you manage assignments:

   - **Current Ticket Status** - Shows "In Pick" if the team is actively picking a ticket
   - **Unfinished Ticket Count** - Number of tickets assigned to this team that are not yet finished (for today)

### Field reference

| Field                     | Description                                                     | Required  |
|---------------------------|-----------------------------------------------------------------|-----------|
| `Code`                    | Unique identifier for the team                                  | Yes       |
| `Members`                 | Free text listing team members (informational)                  | No        |
| `Device Code`             | The picking device (tablet) linked to this team                 | No        |
| `Current Status`          | Shows Picking if the team has an In Pick ticket, otherwise Idle | Read-only |
| `Unfinished Ticket Count` | Count of New, Ready to Pick, or In Pick tickets today           | Read-only |

> **Tip:** Use the **Unfinished Ticket Count** column to balance workload across teams. Assign new tickets to teams with fewer unfinished tickets.

---

## Assigning tickets to teams

After teams are set up, you assign supermarket tickets to them from the ticket list.

### How to assign tickets

1. Open **Supermarket Pick Tickets** (from Picking Dashboard or the search bar).
2. Select one or more tickets you want to assign.
3. Click **Assign to Team** in the action bar.
4. Select the team from the lookup.
5. Click **OK**.

The selected tickets now show the team code in the **Picking Team Code** column.

### Viewing all tickets vs. team tickets

Two toggle actions are available on the ticket list:

- **Show All Tickets** - Removes the team filter and shows every ticket
- **Show My Team** - Reapplies the filter to show only your team's tickets

> **Note:** As a manager without a device assignment, you automatically see all tickets when you open the page. Pickers with a device assignment see only their team's tickets by default.

---

## How pickers see their tickets

When picking teams are active, the system automatically filters tickets for each picker:

1. Picker opens **Supermarket Pick Tickets**.
2. System identifies the picker's team (via device assignment).
3. Only tickets assigned to that team are shown.
4. The picker works their tickets as normal.

**If a picker is not assigned to a device or team**, they see all tickets (no filter applied). This is the same behavior as when the feature is disabled.

The **Picker Activities** cue on the role center also reflects the team filter. The supermarket ticket count shows only the picker's team tickets.

---

## Daily workflow

### At shift start

1. Open **Picking Devices** and update `User ID` for each tablet to match today's pickers.
2. Open **Picking Teams** and update `Members` text and `Device Code` if team composition changed.
3. Open **Supermarket Pick Tickets** and use **Assign to Team** to distribute tickets.

### During the day

- Check **Picking Teams** to monitor workload via **Unfinished Ticket Count**.
- Reassign tickets between teams if needed (select ticket, **Assign to Team**, pick a different team).
- If a picker switches tablets, update the `User ID` on both devices.

### Mid-day team changes

If teams change during the day:

1. Update `User ID` on the affected devices.
2. Update `Device Code` on teams if needed.
3. Reassign tickets if work needs to shift between teams.

> **Note:** No data is lost when you change team or device assignments. Tickets keep their team assignment until you explicitly change it.

---

## Troubleshooting

### Picker sees all tickets instead of just their team's

**Cause:** The picker is not linked to a device, or the device is not linked to a team.

**Solution:**

1. Check **Picking Devices** - Does a device have this picker's `User ID`?
2. Check **Picking Teams** - Does a team have that device's `Code` in `Device Code`?
3. Both links must be in place for the filter to work.

### Team columns and actions are not visible

**Cause:** The feature is not enabled.

**Solution:**

1. Open **Clesen Setup**.
2. Verify **Activate Picking Teams** is on.

### Unfinished Ticket Count shows zero but tickets exist

**Cause:** Tickets may not be assigned to the team, or they may be for a different date.

**Solution:**

1. Open **Supermarket Pick Tickets** and click **Show All Tickets**.
2. Check that tickets have the correct team code in the **Picking Team Code** column.
3. The count only includes tickets with today's picking date.

### Picker cannot find their ticket

**Cause:** The ticket may be assigned to a different team or not assigned at all.

**Solution:**

1. Ask the picker to click **Show All Tickets** to see if the ticket exists.
2. Reassign the ticket to the correct team using **Assign to Team**.

---

## Where to find this

**Picking Devices:** Picking Dashboard > Setup > **Picking Devices**
**Picking Teams:** Picking Dashboard > Setup > **Picking Teams**
**Assign Tickets:** Supermarket Pick Tickets > **Assign to Team**
**Enable/Disable:** Clesen Setup > Picking > **Activate Picking Teams**

---

*For technical details or configuration issues, contact IT support.*

---

## Related documents

- [[Picking-Process]]
- [[master-picking-process]]
- [[master-picking-manager]]
- [[cart-transfer-process]]
- [[cart-transfer-manager]]
- [[supermarket-picking-process]]
- [[single-order-picks]]
- [[delicate-item-handling]]
- [[direct-location-pickup]]
- [[handling-escalations]]
- [[order-lock-process-manager]]
