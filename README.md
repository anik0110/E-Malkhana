

# 🛡️ e-Malkhana: Digital Evidence Management System

**e-Malkhana** is a state-of-the-art digital solution designed to modernize police evidence rooms (Malkhanas). It replaces traditional paper-based registers with a secure, transparent, and efficient digital platform for tracking the Chain of Custody, managing case properties, and automating disposal workflows.

**🔗 View Live Project:** [https://e-malkhana-lovat.vercel.app/](https://e-malkhana-lovat.vercel.app/)

## 🚀 Key Features

* **👮 Secure Officer Authentication:** Role-based access using NextAuth.js.
* **📊 Interactive Dashboard:** Real-time statistics on total, pending, and disposed cases.
* **📦 Evidence Management:**
  * Register new cases with FIR details.
  * Upload images of seized properties (Cloudinary integration).
  * Generate unique **QR Codes** for every item for physical tagging.


* **🔗 Chain of Custody:**
  * Track movement of specific items (e.g., Malkhana → FSL → Court).
  * Log timestamps and remarks for every movement.


* **⚖️ Disposal Workflow:**
  * Dispose of items (Auction, Destroy, Return to Owner).
* **Auto-Close Case:** The system allows closing a case only when all associated properties are disposed.


* **🖨️ Automated Reporting:** Generate professional, printable PDF reports for court submissions.
* **📱 Fully Responsive:** Works seamlessly on Desktops, Tablets, and Mobile devices with a native-app-like sidebar.

## 🛠️ Tech Stack

* **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **Database:** MongoDB (via Mongoose)
* **Authentication:** NextAuth.js
* **Image Storage:** Cloudinary
* **Icons:** Lucide React
* **Utilities:** `qrcode.react`, `jspdf` (for reporting)

## ⚙️ Environment Variables

To run this project, you will need to add the following environment variables to your `.env` file in the root directory:

```env
# Database Connection
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/emalkhana

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_super_secret_random_string

# Cloudinary (Image Uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (Optional - for future features like password reset)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

```

## 💻 Installation & Setup

Follow these steps to set up the project locally:

1. **Clone the repository:**
```bash
git clone https://github.com/your-username/e-malkhana.git
cd e-malkhana

```


2. **Install dependencies:**
```bash
npm install
# or
yarn install

```


3. **Set up Environment Variables:**
Create a `.env` file in the root directory and paste the variables listed above.
4. **Run the development server:**
```bash
npm run dev

```


5. **Open the app:**
Visit `http://localhost:3000` in your browser.


## 🚀 Deployment

The easiest way to deploy your Next.js app is using [Vercel](https://vercel.com/):

1. Push your code to a GitHub repository.
2. Import the project in Vercel.
3. Add your **Environment Variables** in the Vercel dashboard.
4. Click **Deploy**.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open-source and available under the [MIT License](https://www.google.com/search?q=LICENSE).

---

### 👤 Author

**Your Name**

* GitHub: [anik0110](https://github.com/anik0110)


---

*Made with ❤️ for a smarter, safer justice system.*