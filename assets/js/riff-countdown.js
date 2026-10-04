(() => {
  const el = document.querySelector('.temporal-mark');
  if (!el) return;

  // Public decorative countdown. No explanatory label or external event is encoded.
  const TARGET_INSTANT = Date.parse('2033-11-17T00:00:00Z');
  const TARGET = { year: 2033, month: 11, day: 17, hour: 0, minute: 0, second: 0 };

  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23'
  });

  const pad = n => String(Math.max(0, n)).padStart(2, '0');

  function londonParts(date) {
    const out = {};
    for (const part of formatter.formatToParts(date)) {
      if (part.type !== 'literal') out[part.type] = Number(part.value);
    }
    return {
      year: out.year,
      month: out.month,
      day: out.day,
      hour: out.hour,
      minute: out.minute,
      second: out.second
    };
  }

  function daysInMonth(year, month) {
    return new Date(Date.UTC(year, month, 0)).getUTCDate();
  }

  function calendarDiff(now) {
    if (Date.now() >= TARGET_INSTANT) {
      return [0, 0, 0, 0, 0, 0];
    }

    const n = londonParts(now);
    let ty = TARGET.year;
    let tm = TARGET.month;
    let td = TARGET.day;
    let th = TARGET.hour;
    let tmin = TARGET.minute;
    let ts = TARGET.second;

    let seconds = ts - n.second;
    if (seconds < 0) {
      seconds += 60;
      tmin -= 1;
    }

    let minutes = tmin - n.minute;
    if (minutes < 0) {
      minutes += 60;
      th -= 1;
    }

    let hours = th - n.hour;
    if (hours < 0) {
      hours += 24;
      td -= 1;
    }

    let days = td - n.day;
    while (days < 0) {
      tm -= 1;
      if (tm === 0) {
        tm = 12;
        ty -= 1;
      }
      days += daysInMonth(ty, tm);
    }

    let months = tm - n.month;
    if (months < 0) {
      months += 12;
      ty -= 1;
    }

    const years = Math.max(0, ty - n.year);
    return [years, months, days, hours, minutes, seconds];
  }

  function render() {
    const [y, mo, d, h, mi, s] = calendarDiff(new Date());
    el.textContent = [y, mo, d, h, mi, s].map(pad).join(' : ');
  }

  render();
  setInterval(render, 1000);
})();
