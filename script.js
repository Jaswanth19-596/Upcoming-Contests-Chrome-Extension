const getTime = (seconds) => {
  seconds = Math.abs(seconds);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const seconds1 = Math.floor(seconds % 60);
  return `${hours}h ${minutes}m ${seconds1}s`;
};

const logos = new Map([
  ['codechef', 'codechef-logo.png'],
  ['leetcode', 'leetcode-logo.png'],
  ['codeforces', 'codeforces-logo.png'],
  ['codingninjas', 'codingninjas-logo.svg'],
  ['atcoder', 'atcoder-logo.png'],
]);

const createCodeforcesTemplate = (contest) => {
  const container = document.createElement('div');

  const innerHTML = `
  <div class='contest' id=${contest.id}>
    <div class="logo-container"> 
    <img class = 'logo' src = ${logos.get(contest.name)} alt="logo"/>
        </div> 
        <div class='text-container'>
        <div class="contest-name">
        <h2>${contest.event.slice(0, 25)} ${
    contest.event.length > 30 ? '...' : ''
  }</h2>
  </div>
  <div class="description">
    <div class="contest-type">
    <p>Contest By : ${contest.name}</p>
    </div>
    <div class="contest-start-time">
    <p>Contest Starts In : ${getTime(contest.startsIn)}</p>
    </div>
    <div class="contest-end-time">
    <p>Contest Duration : ${getTime(contest.duration)}</p>
    </div>
    </div>
    </div>
    </div>
    </div>
  `;
  container.innerHTML = innerHTML;
  return container;
};

const getSeconds = function (milliseconds) {
  return Math.round(milliseconds / 1000);
};

const getDays = function (seconds) {
  seconds = Math.abs(seconds);
  let minutes = Math.floor(seconds / 60);
  seconds -= minutes * 60;

  let hrs = Math.floor(minutes / 60);
  minutes -= hrs * 60;

  const days = Math.floor(hrs / 24);
  hrs -= days * 24;

  return {
    days,
    hrs,
    minutes,
    seconds,
  };
};

const fetchData = async () => {
  // Fetch contests data from Codeforces API
  const response = await fetch('https://codeforces.com/api/contest.list');
  const contests = await response.json();
  const allContests = contests.result;

  // Adding the logo to each and every contest
  for (let i = 0; i < allContests.length; i++) {
    upcomingContests[i].logo = 'codeforces-logo.png';
  }

  return upcomingContests;
};

// fetchData();
// const getLeetcodeContests = () => {
//   const leetcodeWeeklyContestSeconds = timeUntilNextSaturday();
//   const leetcodeBiweeklyContestSeconds = timeUntilNextSecondSaturday();

//   return [
//     {
//       name: 'Leetcode Weekly Contest',
//       type: 'Weekly',
//       relativeTimeSeconds: leetcodeWeeklyContestSeconds,
//       durationSeconds: 5400,
//       logo: 'leetcode-logo.png',
//     },
//     {
//       name: 'Leetcode Biweekly contest',
//       type: 'Biweekly',
//       relativeTimeSeconds: leetcodeBiweeklyContestSeconds,
//       durationSeconds: 5400,
//       logo: 'leetcode-logo.png',
//     },
//   ];
// };

const displayContests = (contests) => {
  const contestsContainer = document.querySelector('#contests');
  contestsContainer.innerHTML = '';

  for (let contest of contests) {
    const template = createCodeforcesTemplate(contest);
    contestsContainer.appendChild(template);

    // Making the container to open a contest
    const container = document.getElementById(contest.id);
    container.onclick = () => {
      window.open(contest.href, '_blank');
    };
  }
};

var opts = {
  lines: 20, // The number of lines to draw
  length: 6, // The length of each line
  width: 2, // The line thickness
  radius: 10, // The radius of the inner circle
  scale: 1.15, // Scales overall size of the spinner
  corners: 1, // Corner roundness (0..1)
  speed: 1, // Rounds per second
  rotate: 0, // The rotation offset
  animation: 'spinner-line-fade-quick', // The CSS animation name for the lines
  direction: 1, // 1: clockwise, -1: counterclockwise
  color: '#ffffff', // CSS color or array of colors
  fadeColor: 'transparent', // CSS color or array of colors
  top: '75%', // Top position relative to parent
  left: '50%', // Left position relative to parent
  shadow: '0 0 1px transparent', // Box-shadow for the lines
  zIndex: 2000000000, // The z-index (defaults to 2e9)
  className: 'spinner', // The CSS class to assign to the spinner
  position: 'absolute', // Element positioning
};

const main = async () => {
  const checkboxContainer = document.querySelector('.checkbox-container');
  checkboxContainer.style.display = 'none';

  // Making the checkboxes hidden
  const leetcodeCheckbox = document.querySelector('#leetcode');
  const codeforcesCheckbox = document.querySelector('#codeforces');

  const contestsContainer = document.querySelector('#contests');

  // By default, check them both
  leetcodeCheckbox.checked = true;
  codeforcesCheckbox.checked = true;

  var spinner = new Spinner(opts).spin(contestsContainer);
  contestsContainer.appendChild(spinner.el);

  const codeforcesContests = await fetchData();
  const leetcodeContests = getLeetcodeContests();

  checkboxContainer.style.display = 'Block';
  spinner.stop();

  const getContests = () => {
    const allContests = [];
    if (codeforcesCheckbox.checked) {
      allContests.push(...codeforcesContests);
    }

    if (leetcodeCheckbox.checked) {
      allContests.push(...leetcodeContests);
    }
    allContests.sort(
      (a, b) =>
        Math.abs(a.relativeTimeSeconds) - Math.abs(b.relativeTimeSeconds)
    );
    return allContests;
  };

  leetcodeCheckbox.addEventListener('change', () => {
    displayContests(getContests());
  });

  codeforcesCheckbox.addEventListener('change', () => {
    displayContests(getContests());
  });

  const contests = getContests();
  displayContests(contests);
};

// main();

const func = async () => {
  const websites = [
    'leetcode',
    'codeforces',
    'codechef',
    'atcoder',
    'codingninjas',
  ];

  const date = new Date();
  const currentTime = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}T${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  console.log(currentTime);
  const res = await fetch(
    `https://clist.by:443/api/v4/contest/?start__gt=${currentTime}&order_by=start`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          'ApiKey sparker96:4196bd508db94e25402c047be686358b43985359',
      },
    }
  );
  const data = await res.json();

  const filteredContests = [];
  for (const contest of data.objects) {
    // Check if the contest belongs to any of the required websites

    for (const website of websites) {
      if (contest.host.includes(website)) {
        // console.log(Date.parse(contest.start.replace('T', ' ')));
        // Adding the Name of the website for my convenience

        contest.name = website;
        // Reducing 5 hours to be equal to central daylight time
        contest.startsIn =
          (Date.parse(contest.start.replace('T', ' ')) -
            18000000 -
            Date.parse(new Date().toGMTString())) /
          1000;

        console.log(Date.parse(new Date().toUTCString()));
        filteredContests.push(contest);
      }
    }
  }

  console.log(filteredContests);
  displayContests(filteredContests);
};

func();
