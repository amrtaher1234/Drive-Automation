import { google } from "googleapis";
import fs from "fs";
import readline from "readline-sync";

const CREDENTIALS_PATH = "credentials.json";

const TOKEN_PATH = "token.json";

const SCOPES = ["https://www.googleapis.com/auth/drive"];

interface Module {
  moduleName: string;
  sections: {
    sectionName: string;
    subsections?: { sectionName: string }[];
  }[];
}

const modules: Module[] = [
  {
    moduleName: "Module 1: Introduction and Getting Started",
    sections: [
      { sectionName: "Welcome to the Course" },
      { sectionName: "What's New in NextJS 14" },
      { sectionName: "Understanding the App Router" },
      { sectionName: "Creating your first NextJS App" },
      { sectionName: "Editing the application and adding a new page" },
    ],
  },
  {
    moduleName: "Module 2: NextJS Core Concepts",
    sections: [
      { sectionName: "File-Based Routing in Depth" },
      { sectionName: "Layouts, Nested Routes, and Global Components" },
      { sectionName: "Error Handling and Custom Error Pages" },
      { sectionName: "Static Assets and Image Optimization" },
      { sectionName: "Understanding Pages, Components, and Modules" },
    ],
  },
  {
    moduleName: "Module 3: Building the Project Foundation",
    sections: [
      { sectionName: "Project Overview and Planning" },
      { sectionName: "Setting Up Project Structure with the App Directory" },
      { sectionName: "Creating Shared Layouts and Templates" },
      { sectionName: "Implementing Global Styles and CSS Modules" },
      { sectionName: "Adding Navigation and Links" },
    ],
  },
  {
    moduleName: "Module 4: Advanced Routing and Data Fetching",
    sections: [
      { sectionName: "Dynamic Routes and Segments" },
      { sectionName: "Catch-All Routes and Optional Catch-All Routes" },
      { sectionName: "Programmatic Navigation with the Router" },
      { sectionName: "Middleware and Custom Routing" },
      {
        sectionName: "Data Fetching Methods",
        subsections: [
          { sectionName: "Server-Side Data Fetching" },
          { sectionName: "Client-Side Data Fetching" },
          { sectionName: "Incremental Static Regeneration (ISR)" },
          { sectionName: "Using the use Hook for Async Data" },
        ],
      },
    ],
  },
  {
    moduleName: "Module 5: Server and Client Components",
    sections: [
      { sectionName: "Server Components Overview" },
      { sectionName: "Client Components and Interactivity" },
      { sectionName: "Combining Server and Client Components" },
      { sectionName: "Hydration and Rendering Strategies" },
    ],
  },
  {
    moduleName: "Module 6: Integrating Data and State Management",
    sections: [
      { sectionName: "Connecting to an API or Database" },
      { sectionName: "Displaying Dynamic Content" },
      { sectionName: "Implementing Loading and Error States" },
      { sectionName: "Form Handling and User Input" },
      {
        sectionName: "Managing Local and Global State",
        subsections: [
          { sectionName: "Using React Hooks for State Management" },
          { sectionName: "Implementing Context API for Global State" },
        ],
      },
    ],
  },
  {
    moduleName: "Module 7: API Routes and Serverless Functions",
    sections: [
      { sectionName: "Introduction to API Routes" },
      { sectionName: "Building CRUD Operations" },
      { sectionName: "Server Actions and Mutations" },
      { sectionName: "Integrating with Databases" },
      { sectionName: "Securing API Routes" },
    ],
  },
  {
    moduleName: "Module 8: Enhancing the User Experience",
    sections: [
      { sectionName: "Implementing Pagination and Infinite Scroll" },
      { sectionName: "Search and Filtering" },
      { sectionName: "Optimizing Images and Media" },
      { sectionName: "Accessibility Best Practices" },
      {
        sectionName: "Internationalization (i18n) and Localization",
        subsections: [
          { sectionName: "Setting Up Localization" },
          { sectionName: "Creating Language-Specific Content" },
          { sectionName: "Implementing Language Switchers" },
          { sectionName: "Formatting and Localization" },
        ],
      },
    ],
  },
  {
    moduleName: "Module 9: Authentication and Security",
    sections: [
      { sectionName: "Implementing Authentication with NextAuth.js" },
      { sectionName: "Protecting Client and Server-Side Routes" },
      { sectionName: "Role-Based Access Control" },
      { sectionName: "Securing API Routes and Middleware" },
    ],
  },
  {
    moduleName: "Module 10: Testing, Optimization, Deployment, and Wrap-Up",
    sections: [
      {
        sectionName: "Testing Components and Pages",
        subsections: [
          { sectionName: "Unit Testing with Jest" },
          { sectionName: "Integration Testing" },
          { sectionName: "End-to-End Testing with Cypress" },
        ],
      },
      {
        sectionName: "Performance Optimization",
        subsections: [
          { sectionName: "Analyzing Performance Metrics" },
          { sectionName: "Code Splitting and Dynamic Imports" },
          { sectionName: "Caching Strategies" },
        ],
      },
      {
        sectionName: "Preparing for Production",
        subsections: [
          { sectionName: "Environment Variables" },
          { sectionName: "Build Settings" },
        ],
      },
    ],
  },
];

async function main() {
  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, "utf8"));
  const { client_secret, client_id } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    "urn:ietf:wg:oauth:2.0:oob",
  );

  // Check if we have previously stored a token.
  if (fs.existsSync(TOKEN_PATH)) {
    const token = fs.readFileSync(TOKEN_PATH, "utf8");
    oAuth2Client.setCredentials(JSON.parse(token));
  } else {
    await getAccessToken(oAuth2Client);
  }

  const drive = google.drive({ version: "v3", auth: oAuth2Client });

  const mainFolderId = await createFolder(drive, "NextJS course");

  for (const module of modules) {
    const moduleFolderId = await createFolder(drive, module.moduleName, mainFolderId);

    for (const subSection of module.sections) {
      const subSectionFolderId = await createFolder(
        drive,
        subSection.sectionName,
        moduleFolderId,
      );

      const docName = "script";
      await createGoogleDoc(drive, docName, subSectionFolderId);
    }
  }

  console.log("Folder and file structure created successfully.");
}

async function getAccessToken(oAuth2Client: any) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  console.log("Authorize this app by visiting this url:", authUrl);
  const code = readline.question("Enter the code from that page here: ");

  const { tokens } = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials(tokens);

  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
  console.log("Token stored to", TOKEN_PATH);
}

async function createFolder(
  drive: any,
  name: string,
  parentId?: string,
): Promise<string> {
  const fileMetadata: any = {
    name,
    mimeType: "application/vnd.google-apps.folder",
  };

  if (parentId) {
    fileMetadata.parents = [parentId];
  }

  const res = await drive.files.create({
    resource: fileMetadata,
    fields: "id",
  });

  return res.data.id;
}

async function createGoogleDoc(drive: any, name: string, parentId: string) {
  const fileMetadata = {
    name,
    mimeType: "application/vnd.google-apps.document",
    parents: [parentId],
  };

  await drive.files.create({
    resource: fileMetadata,
    fields: "id",
  });
}

main().catch(console.error);
