import axios from "axios";

const translateSingleMessage = async (text, language) => {
  // options: we can also detect the result by a specific string.
  const response = await axios.post(
    "https://api.openai.com/v1/engines/text-davinci-003/completions",
    {
      prompt: `Translate the following message to ${language}: ${text}.  
      If it is already in ${language} or can't be translated,please return the original text.
      If it contains emoji, please keep it there.
      `,
      max_tokens: 60,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );
  const translatedMessage = response.data.choices[0].text.trim();
  return translatedMessage;
};

//messages type: an array of {fromSelf: , message: ""}
const translateAllMessages = async (messages, language) => {
  const translatedMessages = await Promise.all(
    messages.map(async (message) => {
      const translatedMessage = await translateSingleMessage(
        message.message,
        language
      );
      return { ...message, message: translatedMessage };
    })
  );
  return translatedMessages;
};

export { translateSingleMessage, translateAllMessages };
