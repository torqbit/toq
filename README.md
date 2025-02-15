<br /><br />

<p align="center">
  <a href="https://www.torqbit.com">
    <img src="./public/img/brand/torqbit-icon.png"" width="80px" alt="Torqbit logo" />
  </a>
</p>
<h2 align="center" >The Open-Source LMS for businesses</h3>
<p align="center">Create unmatched learning experience for your  customers</p>

<p align="center"><a href="https://torqbit.com">🌐 Website</a> · <a href="https://torqbit.com/docs">📚 Documentation</a>

<p align="center">
  <a href="https://www.torqbit.com.com">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="./public/readme/torqbit-dark.png">
      <source media="(prefers-color-scheme: light)" srcset="./public/readme/torqbit-light.png">
      <img src="./public/readme/torqbit-os-hero.png" alt="Companies view" />
    </picture>
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/github/commit-activity/m/torqbit/torqbit" alt="Commit Activity">
  <img src="https://img.shields.io/docker/pulls/torqbit/torqbit" alt="Docker Pulls">
</p>

<br>

Torqbit is an open-source learning management system tailored for software companies to effectively train their customers. It offers unparalleled customization of your academy page, allowing you to align it with your brand identity. With self-hosting capabilities, you maintain complete control over your data and users, ensuring privacy and security. This flexibility empowers organizations to adapt the platform to their unique requirements, integrate seamlessly with existing tools, and enhance the overall user experience.

⚠️ Torqbit is currently under active development. Expect a series of updates in the coming weeks.

## 🍙 Self Hosting

### Prerequisite

Development system must have docker engine installed and running.

### Steps

Setting up local environment is extremely easy and straight forward. Follow the below step and you will be ready to contribute

1. Clone the code locally using `git clone https://github.com/torqbit/torqbit`
1. Switch to the code folder `cd torqbit`
1. Edit the `docker-compose.yml` file to include the Google & Github client credentials, and the email id that will be the admin for the platform.
1. Now run the command `docker-compose up` to launch the web app and the MySQL server.

You are ready to play around the platform. Do not forget to refresh the browser (in case it does not auto-reload)

Thats it!

## 🚀 Features

- **Manage Courses**: Create courses with video lessons.
- **Video Streaming**: Stream your course videos, which are powered by Bunny.net
- **Tracking Learning Progress**: Monitor learning progress with detailed analytics, enabling learners and instructors to assess skill development and mastery.
- **Course Discussion**: Foster collaboration and engagement through course-specific discussion forums, facilitating knowledge sharing and peer interaction.
- **Alert Comment Notification**: Enable timely communication by alerting users to new comments and replies to queries, enabling greater engagment.
