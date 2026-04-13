# TODO: Manage Time Slots with script.js

## Steps to Complete:

### 1. ✅ Create TODO.md (current)

### 2. Update script.js ✅
- Add `generateTimeSlots()` function to dynamically create time slots (09:00 to 18:00, 30min intervals).
- Clear existing slots, generate new ones, attach click handlers.
- Integrate with date change: regenerate on valid date selection + availability check.
- Preserve `selectedTime` logic.
- Add `updateSlotAvailability()` for past time disabling.

### 3. Update index.html ✅
- Remove all 20 static `<div class="time-slot">` elements from `#timeSlots`.
- Leave empty `<div class="time-slots" id="timeSlots"></div>`.
- Ensure form structure intact.

### 4. Test Changes ✅
- Reload page: time slots appear dynamically via script.js.
- Select date → slots regenerate + past times disabled if today.
- Select time → validation, submit works, modal shows correctly.
- Visual: 6-column grid preserved, disabled slots styled.

### 5. Task Complete ✅
