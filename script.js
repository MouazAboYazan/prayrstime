const prayerTimesUrl = "https://api.aladhan.com/v1/timingsByCity?city=Tampa&country=US&method=2";

fetch(prayerTimesUrl)
	.then(response => response.json())
	.then(data => {
		const prayerTimes = data.data.timings;
		const hijriDate = data.data.date.hijri.month.ar + ' ' + data.data.date.hijri.day + ', ' + data.data.date.hijri.year;
		const currentTime = new Date();

		let nextPrayer;
		let nextPrayerTime;

		for (const [prayer, time] of Object.entries(prayerTimes)) {
			if (prayer === 'Fajr' || prayer === 'Dhuhr' || prayer === 'Asr' || prayer === 'Maghrib' || prayer === 'Isha') {
				const prayerTime = new Date(`${data.data.date.readable} ${time}`);
				if (prayerTime > currentTime) {
					nextPrayer = prayer;
					nextPrayerTime = prayerTime;
          
					break;
				}
			}
		}

    

    

		const prayerTimesElement = document.getElementById("prayer-times");
		const hijriDateElement = document.getElementById("hijri-date");
		const countdownTimerElement = document.getElementById("countdown-timer");

		const table = document.createElement('table');
		const tableHeader = document.createElement('tr');
		tableHeader.innerHTML = `
			<th>الصلاة</th>
			<th>الوقت</th>
		`;
		table.appendChild(tableHeader);

		const prayerNames = {
			Fajr: 'الفجر',
			Dhuhr: 'الظهر',
			Asr: 'العصر',
			Maghrib: 'المغرب',
			Isha: 'العشاء'
		};

		for (const [prayer, time] of Object.entries(prayerTimes)) {
			if (prayer === 'Fajr' || prayer === 'Dhuhr' || prayer === 'Asr' || prayer === 'Maghrib' || prayer === 'Isha') {
				const prayerTime = new Date(`${data.data.date.readable} ${time}`);
				const formattedPrayerTime = prayerTime.toLocaleString('ar-SA', {hour: 'numeric', minute: 'numeric', hour12: true});
				const tableRow = document.createElement('tr');
				tableRow.innerHTML = `
					<td>${prayerNames[prayer]}</td>
					<td>${formattedPrayerTime}</td>
          `;
          table.appendChild(tableRow);
          }
          }
          prayerTimesElement.appendChild(table);

          hijriDateElement.textContent = `التاريخ الهجري: ${hijriDate}`;
        
          if (nextPrayer) {
            const countdownInterval = setInterval(() => {
              const currentTime = new Date();
              const countdownTime = nextPrayerTime - currentTime;
              const hours = Math.floor(countdownTime / (1000 * 60 * 60));
              const minutes = Math.floor((countdownTime % (1000 * 60 * 60)) / (1000 * 60));
              const seconds = Math.floor((countdownTime % (1000 * 60)) / 1000);
              countdownTimerElement.textContent = `الصلاة القادمة: ${prayerNames[nextPrayer]} بعد ${hours}س ${minutes}د ${seconds}ث`;
        
              if (countdownTime <= 0) {
                clearInterval(countdownInterval);
                countdownTimerElement.textContent = `وقت ${prayerNames[nextPrayer]} الآن.`;
                Notification.requestPermission().then(function(permission) {
                  if(permission === "granted") {
                      new Notification(`وقت ${prayerNames[nextPrayer]}`);
                  }
                });
              }
            }, 1000);
          }
        });
        
