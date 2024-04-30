const getTime = (seconds) => {
  seconds = Math.abs(seconds);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const seconds1 = Math.floor(seconds % 60);
  return `${hours}h ${minutes}m ${seconds1}s`;
};

const createCodeforcesTemplate = (contest) => {
  return ` <div class="contest">
    <div class="contest-name">
      <h2>Contest Name : ${contest.name}</h2>
    </div>
    <div class="description">
      <div class="contest-type">
        <p>Contest type : ${contest.type}</p>
      </div>
      <div class="contest-start-time">
        <p>Contest Starts In : ${getTime(contest.relativeTimeSeconds)}</p>
      </div>
      <div class="contest-end-time">
        <p>Contest Duration : ${getTime(contest.durationSeconds)}</p>
      </div>
    </div>
  </div>`;
};


const createLeetcodeTemplate = (contest) => {
  return ` <div class="contest">
    <div class="contest-name">
      <h2>Contest Name : ${contest.name}</h2>
    </div>
    <div class="description">
      <div class="contest-type">
        <p>Contest type : ${contest.type}</p>
      </div>
      <div class="contest-start-time">
        <p>Contest Starts In : ${getTime(contest.relativeTimeSeconds)}</p>
      </div>
      <div class="contest-end-time">
        <p>Contest Duration : ${getTime(5400)}</p>
      </div>
    </div>
  </div>`;
};

// const fetchData = async (leetcode=false, codeforces = false) => {
//   const response = await fetch('https://codeforces.com/api/contest.list');

//   const contests = await response.json();
//   const allContests = contests.result;

//   const upcomingContests = [];

//   for (let i = 0; i < allContests.length; i++) {
//     if (allContests[i].phase !== 'BEFORE') break;

//     upcomingContests.push(allContests[i]);
//   }
//   console.log(upcomingContests);
//   const contestsContainer = document.querySelector('#contests');

//   for (let i = upcomingContests.length - 1; i >= 0; i--) {
//     const contest = upcomingContests[i];
//     const contestTemplate = document.createElement('div');
//     contestTemplate.innerHTML = createCodeforcesTemplate(contest);
//     contestsContainer.appendChild(contestTemplate);
//   }

//   // console.log(upcomingContests);
// };


const fetchData = async (leetcode = false, codeforces = false) => {
    // Fetch contests data from Codeforces API
    const response = await fetch('https://codeforces.com/api/contest.list');
    const contests = await response.json();
    const allContests = contests.result;

    // Filter upcoming contests
    const upcomingContests = [];
    for (let i = 0; i < allContests.length; i++) {
        if (allContests[i].phase !== 'BEFORE') break;
        upcomingContests.push(allContests[i]);
    }





    // Function to calculate time until the next Saturday
    const timeUntilNextSaturday = () => {
        console.log("Hehe")

        const today = new Date();
        const date = today.getDate();
        const dayOfWeek = today.getDay();
        const year = today.getFullYear();
        const month = today.getMonth();
        const hours = 9;
        const minutes = 30;

        const final = new Date(date, month, year, hours, minutes );

        console.log(final);



        // const dayOfWeek = today.getDay();
        // const hours = today.getHours();
        // const minutes = today.getMinutes();

        console.log(dayOfWeek);

        // Calculate time until the next Saturday (assuming contests are on Saturday)
        let daysToAdd = 6 - dayOfWeek; // Days until Saturday
        if (hours > 21 || (hours === 21 && minutes >= 30)) {
            daysToAdd += 7; // If it's already past 9:30 PM on Saturday, move to next week
        }
        const nextSaturday = new Date(today.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
        nextSaturday.setHours(21); // Set the time to 9:30 PM
        nextSaturday.setMinutes(30);
        return Math.ceil((nextSaturday.getTime() - today.getTime()) / (1000 * 60 * 60)); // Time until next Saturday in hours
    };

    // Function to calculate time until the next second Saturday
    const timeUntilNextSecondSaturday = () => {
      console.log("Haha")

      
        const today = new Date();
        const date = today.getDate();
        const dayOfWeek = today.getDay();
        const year = today.getFullYear();
        const month = today.getMonth();
        const hours = 9;
        const minutes = 30;

        const final = new Date(year, month, date, hours, minutes );

        // const today = new Date();
        

        console.log(final);
        console.log(today - final)

        // const today = new Date();
        // const dayOfMonth = today.getDate();
        // const day = today.getDay();
        // const hours = today.getHours();
        // const minutes = today.getMinutes();


        // Calculate time until the next second Saturday of the month
        let daysToAdd;
        if (dayOfMonth <= 7) {
            daysToAdd = 7 - dayOfMonth; // If it's before the first Saturday, go to the first Saturday
        } else {
            daysToAdd = 14 - (dayOfMonth % 7); // If it's after the first Saturday, go to the second Saturday
        }
        const nextSecondSaturday = new Date(today.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
        nextSecondSaturday.setHours(9); // Set the time to 9:30 AM
        nextSecondSaturday.setMinutes(30);
        return Math.ceil((nextSecondSaturday.getTime() - today.getTime()) / (1000 * 60 * 60)); // Time until next second Saturday in hours
    };

    // Calculate time until the next LeetCode contest based on checkboxes
    const leetcodeContestTime = (leetcode && upcomingContests.length === 0) ? 
                                (timeUntilNextSaturday() + 24 * (upcomingContests.length > 0)) :
                                (leetcode && upcomingContests.length > 0) ? 
                                (timeUntilNextSecondSaturday()) : 0;
                                
    const contestsContainer = document.querySelector('#contests');
    // Display time until next LeetCode contest
    if (leetcode) {
        const leetcodeElement = document.createElement('div');
        const contest = {
          name : 'Leetcode Contest',
          durationSeconds : 1500,
          relativeTimeSeconds : leetcodeContestTime,
          type : 'Weekly'
        }
        leetcodeElement.innerHTML = createLeetcodeTemplate(contest);
        contestsContainer.appendChild(leetcodeElement);
    }

    // Display upcoming contests from Codeforces
    for (let i = upcomingContests.length - 1; i >= 0; i--) {
        const contest = upcomingContests[i];
        const contestTemplate = document.createElement('div');
        contestTemplate.innerHTML = createCodeforcesTemplate(contest);
        contestsContainer.appendChild(contestTemplate);
    }
};



const leetcodeCheckbox = document.querySelector('#leetcode')
const codeforcesCheckbox = document.querySelector('#codeforces')




const reload = ()=>{
    const leetcode = leetcodeCheckbox.checked;
    const codeforces = codeforcesCheckbox.checked;

    fetchData(leetcode, codeforces);

    console.log("Reloaded")
}



leetcodeCheckbox.addEventListener('change', ()=>{
    reload()
})

codeforcesCheckbox.addEventListener('change', ()=>{
    reload();
})


fetchData();