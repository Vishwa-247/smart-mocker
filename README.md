# Smart Mocker

Smart Mocker is an AI-powered platform designed to help users enhance their interview skills through interactive mock interviews. Users can select their job role, tech stack, and years of experience, and the platform dynamically generates interview questions. After answering the questions, the AI provides correct answers, feedback, and ratings to help users improve.

## Features
- **User Authentication**: Secure login and personalized dashboard.
- **Dynamic Interview Questions**: Tailored questions based on job role, tech stack, and experience level.
- **AI-Powered Feedback**: Instant feedback, correct answers, and ratings for submitted responses.
- **Interactive Experience**: Simulates real interview scenarios to help users gain confidence.

## Tech Stack
- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **AI Integration**: OpenAI API / Custom NLP Model
- **Authentication**: NextAuth.js / Firebase Auth
- **Deployment**: Vercel

## Installation & Setup

### Prerequisites
Ensure you have the following installed:
- **Node.js** (>=16.0)
- **npm** / **yarn** / **pnpm** / **bun**

### Clone the Repository
```bash
git clone https://github.com/your-username/smart-mocker.git
cd smart-mocker
```

### Install Dependencies
```bash
npm install  # or yarn install / pnpm install / bun install
```

### Set Up Environment Variables
Create a `.env.local` file in the root directory and configure the necessary environment variables:
```env
NEXT_PUBLIC_API_URL=your_api_endpoint
MONGO_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_auth_secret
OPENAI_API_KEY=your_openai_api_key
```

### Run the Development Server
```bash
npm run dev  # or yarn dev / pnpm dev / bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

## Deployment
The easiest way to deploy the Next.js app is using **Vercel**:
1. Push your code to GitHub.
2. Connect your repository to [Vercel](https://vercel.com/).
3. Configure environment variables in Vercel settings.
4. Deploy and access your live site!

## Contributing
Contributions are welcome! Follow these steps:
1. Fork the repository.
2. Create a new branch: `git checkout -b feature-name`
3. Make your changes and commit: `git commit -m 'Add feature X'`
4. Push to the branch: `git push origin feature-name`
5. Open a pull request.

## License
This project is licensed under the **MIT License**. Feel free to use and modify it as needed.

## Contact
For any queries or suggestions, feel free to reach out at [vishwathouti247@gmail.com](mailto:your-email@example.com).

---

Enjoy coding and happy interviewing! 🚀

