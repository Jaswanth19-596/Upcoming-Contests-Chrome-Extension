const getTime = (seconds) => {
  seconds = Math.abs(seconds);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const seconds1 = Math.floor(seconds % 60);
  return `${hours}h ${minutes}m ${seconds1}s`;
};

const logos = new Map([
  ['codechef', './logos/codechef-logo.png'],
  ['leetcode', './logos/leetcode-logo.png'],
  ['codeforces', './logos/codeforces-logo.png'],
  ['codingninjas', './logos/codingninjas-logo.svg'],
  ['atcoder', './logos/atcoder-logo.png'],
]);

const createContestTemplate = (contest) => {
  const container = document.createElement('div');

  const innerHTML = `
  <div class='contest' id=${contest.id}>
    <div class="logo-container"> 
      <img class = 'logo' src = ${logos.get(contest.name)} alt="logo"/>
    </div> 
    <div class='text-container'>
        <div class="contest-name">
        <h2>${contest.event.slice(0, 25)} ${
    contest.event.length > 25 ? '...' : ''
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
    <div class="arrow-container">
      <p class='enter-contest-para'>Enter Contest:   </p>
      <img src='logos/arrow.png' alt='arrow' class='arrow'>
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

const displayContests = (contests) => {
  const contestsContainer = document.querySelector('#contests');
  contestsContainer.innerHTML = '';

  for (let contest of contests) {
    const template = createContestTemplate(contest);
    contestsContainer.appendChild(template);

    // Making the container to open a contest
    const container = document.getElementById(contest.id);
    container.onclick = () => {
      window.open(contest.href, '_blank');
    };
  }
};

// Stores the fetched contests
let fetchedContests = [];

// Get all the checkboxes.
const websiteCheckboxes = document.querySelectorAll('.website');

// Add event listeners to al the checkboxes
websiteCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener('click', () => {
    // When a checkbox is clicked, update the contests
    filterSelectedContests(checkbox);
  });
});

// Filters the contests
const filterSelectedContests = (checkbox) => {
  // Holds the selected websites names
  const selectedWebsites = [];

  // Get all the selected checkboxes
  const selectedCheckboxes = document.querySelectorAll(
    '.checked .website-name'
  );

  for (const checkbox of selectedCheckboxes) {
    selectedWebsites.push(checkbox.textContent.toLowerCase());
  }

  // If there are no selected checkboxes, display all the contests
  if (selectedWebsites.length === 0) {
    displayContests(fetchedContests);
    return;
  }

  // If there are selected checkboxes, filter the contests
  const filteredContests = [];

  // For each contest, check if the website name is in the selected websites
  for (const contest of fetchedContests) {
    if (selectedWebsites.includes(contest.name)) {
      filteredContests.push(contest);
    }
  }
  // Display the filtered contests
  displayContests(filteredContests);
};

// Fetches the contests
const fetchContests = async () => {
  const date = new Date(Date.parse(new Date()) + 18000000);
  console.log(date);
  const currentTime = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}T${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

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
  return data.objects;
};

const main = async () => {
  // These are the available coding websites
  const availableCodingWebsites = [
    'leetcode',
    'codeforces',
    'codechef',
    'atcoder',
    'codingninjas',
  ];

  // Get the contests container
  const contestsContainer = document.querySelector('#contests');

  // Get the spinner and display it.
  var spinner = new Spinner(opts).spin(contestsContainer);
  contestsContainer.appendChild(spinner.el);

  // Fetch all the contests
  const contests = await fetchContests();

  // Filter all the contests and select only required contests.
  const filteredContests = [];

  // For each contest, check if it belongs to any of the available websites.
  for (const contest of contests) {
    for (const website of availableCodingWebsites) {
      if (contest.host.includes(website)) {
        // Add the name to the contest
        contest.name = website;
        // Reducing 5 hours to be equal to central daylight time
        contest.startsIn =
          (Date.parse(contest.start.replace('T', ' ')) -
            18000000 -
            Date.parse(new Date().toGMTString())) /
          1000;

        filteredContests.push(contest);
      }
    }
  }
  // Stop the spinner and display the contests
  spinner.stop();

  fetchedContests = filteredContests;
  displayContests(filteredContests);
};

main();
