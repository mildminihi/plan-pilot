// app.js
const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle form submission
app.post('/submit-travel-plan', (req, res) => {
    const travelData = req.body;

    // Generate AI prompt from the collected data
    const aiPrompt = generateAIPrompt(travelData);

    console.log('Travel Plan Data:', travelData);
    console.log('Generated AI Prompt:', aiPrompt);

    // Return response with the generated prompt
    res.json({
        success: true,
        message: 'Travel plan submitted successfully!',
        aiPrompt: aiPrompt,
        data: travelData
    });
});

// Function to generate AI prompt from travel data
function generateAIPrompt(data) {
    let prompt = "Create a detailed travel plan with the following information:\n\n";

    if (data.tripName) {
        prompt += `Trip Name: ${data.tripName}\n`;
    }

    prompt += `Origin: ${data.originCountry}\n`;
    prompt += `Destination: ${data.destinationCountry}\n`;
    prompt += `Duration: ${data.travelDays} days\n\n`;

    if (data.flightInfo) {
        prompt += `Flight Information:\n${data.flightInfo}\n\n`;
    }

    if (data.hotelInfo) {
        prompt += `Hotel Booking Details:\n${data.hotelInfo}\n\n`;
    }

    if (data.budget) {
        prompt += `Budget: ${data.budget}\n\n`;
    }

    if (data.interests) {
        prompt += `Interests and Preferences:\n${data.interests}\n\n`;
    }

    prompt += "Please provide:\n";
    prompt += "1. A detailed daily itinerary\n";
    prompt += "2. Recommended activities and attractions\n";
    prompt += "3. Local cuisine suggestions\n";
    prompt += "4. Transportation tips\n";
    prompt += "5. Cultural insights and travel tips\n";
    prompt += "6. Budget breakdown if budget was provided\n";

    return prompt;
}

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});