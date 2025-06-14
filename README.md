# build-your-keyboard

A React-based keyboard configurator that allows users to customize their keyboard by selecting different components and seeing a live preview.

## Features

- Interactive keyboard customization
- Live preview of selected components
- Step-by-step configuration process
- Real-time price calculation
- Responsive design
- Beautiful UI with TailwindCSS

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Move images to public directory:
   ```bash
   node move-images.js
   ```
4. Start the development server:
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3000`

## Project Structure

```
keyboard-configurator/
├── public/
│   ├── images/
│   │   ├── Body/
│   │   ├── Plate/
│   │   ├── Switches/
│   │   └── Keycaps/
│   └── index.html
├── src/
│   ├── App.jsx
│   ├── KeyboardConfigurator.jsx
│   ├── index.js
│   └── index.css
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## Usage

1. Select a body color
2. Choose a plate type
3. Pick your switches
4. Select keycaps
5. Review your selection and total price

## Pricing

- Base keyboard: ₹6,999
- Switches:
  - Blue: ₹0
  - Brown/Red/Black: ₹580
  - All lubed switches: ₹1,300
- Plate:
  - Mirror: ₹0
  - Others: ₹800
- Keycaps: ₹1,200

## Technologies Used

- React
- TailwindCSS
- Node.js
- npm

## License

MIT 