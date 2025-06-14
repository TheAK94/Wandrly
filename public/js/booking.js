function showBookingError(message) {
    const modalBody = document.getElementById("bookingModalBody");
    modalBody.textContent = message;
    const modal = new bootstrap.Modal(document.getElementById("bookingModal"));
    modal.show();
}


function getBlockedDates(ranges) {
    const dates = [];
    for (let range of ranges) {
        let current = new Date(range.startDate);
        const end = new Date(range.endDate);
        while (current <= end) {
            dates.push(current.toLocaleDateString('en-CA').split("T")[0]);
            current.setDate(current.getDate() + 1);
        }
    }
    return dates;
}

const disabledDates = getBlockedDates(bookedRanges);

const today = new Date();
const oneMonthLater = new Date();
oneMonthLater.setMonth(today.getMonth() + 1);
const maxDateStr = oneMonthLater.toLocaleDateString('en-CA').split("T")[0];

document.addEventListener("DOMContentLoaded", () => {
    const bookingInput = document.getElementById("bookingDateRange");
    const startInput = document.getElementById("startDate");
    const endInput = document.getElementById("endDate");
    const totalPriceElement = document.getElementById("totalPrice");

    const taxRate = 0.18;

    flatpickr(bookingInput, {
        mode: "range",
        dateFormat: "Y-m-d",
        minDate: "today",
        maxDate: new Date().fp_incr(30), // 1 month ahead
        disable: disabledDates,
        onChange: function(selectedDates) {
            if (selectedDates.length === 2) {
                const start = selectedDates[0];
                const end = selectedDates[1];

                const diffTime = end - start;
                const nights = diffTime / (1000 * 60 * 60 * 24);

                if (nights < 1) {
                    showBookingError("Minimum booking is 1 night.");
                    this.clear();
                    return;
                }

                if (nights > 7) {
                    showBookingError("Maximum booking is 7 nights.");
                    this.clear();
                    return;
                }

                startInput.value = start.toLocaleDateString('en-CA').split("T")[0];
                endInput.value = end.toLocaleDateString('en-CA').split("T")[0];

                const baseTotal = nights * pricePerNight;
                const taxAmount = baseTotal * taxRate;
                const finalTotal = baseTotal + taxAmount;

                totalPriceElement.innerHTML = `
                    <div>${nights} nights</div>
                    <div class="mt-1">Total Price: ₹${finalTotal.toFixed(2)} <span class="tax-info text-muted">(incl. taxes)</span></div>
                `;
            } else {
                startInput.value = "";
                endInput.value = "";
                totalPriceElement.innerText = "Total Price: ₹0";
            }
        }
    });
});
