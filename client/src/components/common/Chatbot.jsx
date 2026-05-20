import { useState, useEffect, useRef } from 'react';
import api from '../../services/api';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "Hi there! 👋 I'm OdysseyBot, your virtual travel assistant. Where would you like to travel next? Ask me about our destinations or click a helper option below!",
      time: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const suggestions = [
    'Recommend a trip 🌟',
    'How do I book? 🗺️',
    'Cheapest packages 💸',
    'Tell me about Bali 🏖️',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    if (!textToSend) setInput('');

    // Add user message
    setMessages((prev) => [...prev, { sender: 'user', text, time: new Date() }]);
    setIsLoading(true);

    try {
      const response = await api.post('/chatbot', { message: text });
      const botResponse = response.data.response || "I'm sorry, I couldn't process that.";
      setMessages((prev) => [...prev, { sender: 'bot', text: botResponse, time: new Date() }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: "Oops! I'm having trouble connecting right now. Please try again in a bit.",
          time: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Chat toggle FAB */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-transform hover:scale-110 active:scale-95 focus:outline-none hover:bg-blue-700 dark:bg-indigo-600 dark:hover:bg-indigo-700"
          title="Chat with travel assistant"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-7 w-7 animate-pulse"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.625 9.75a.625.625 0 1 1-1.25 0 .625.625 0 0 1 1.25 0Zm0 0H8.25m4.125 0a.625.625 0 1 1-1.25 0 .625.625 0 0 1 1.25 0Zm0 0H12m4.125 0a.625.625 0 1 1-1.25 0 .625.625 0 0 1 1.25 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .771-.339c.9.005 1.797-.005 2.68-.089 1.583-.148 2.707-1.545 2.707-3.146V5.25c0-1.637-1.193-3.096-2.825-3.236a48.755 48.755 0 0 0-12.826 0C2.923 2.155 1.729 3.613 1.729 5.25v7.518Z"
            />
          </svg>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="flex h-[500px] w-[360px] flex-col rounded-2xl border border-gray-200 bg-white/95 shadow-2xl backdrop-blur-md transition-all duration-300 dark:border-gray-800 dark:bg-gray-900/95 sm:w-[400px]">
          {/* Header */}
          <div className="flex items-center justify-between rounded-t-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white dark:from-indigo-600 dark:to-purple-700">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-xl font-bold">
                  🤖
                </div>
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-400 dark:border-gray-900" />
              </div>
              <div>
                <h3 className="font-semibold leading-tight">OdysseyBot</h3>
                <span className="text-xs text-blue-100 dark:text-indigo-200">Online Travel Assistant</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1 text-white/80 hover:bg-white/10 hover:text-white focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-gray-200">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none dark:bg-indigo-600'
                      : 'bg-gray-100 text-gray-800 rounded-bl-none dark:bg-gray-800 dark:text-gray-100'
                  }`}
                >
                  <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                  <span
                    className={`block text-[10px] mt-1 text-right ${
                      msg.sender === 'user' ? 'text-blue-200' : 'text-gray-400'
                    }`}
                  >
                    {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-2xl rounded-bl-none bg-gray-100 px-4 py-3 dark:bg-gray-800">
                  <div className="flex space-x-1.5 py-1">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]" />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]" />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          {!isLoading && (
            <div className="border-t border-gray-100 px-4 py-2.5 dark:border-gray-800">
              <div className="flex flex-wrap gap-1.5">
                {suggestions.map((sug, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(sug.replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, '').trim())}
                    className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 active:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Footer */}
          <div className="flex items-center space-x-2 border-t border-gray-200 p-3 bg-white dark:border-gray-800 dark:bg-gray-900 rounded-b-2xl">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask about destinations, pricing..."
              className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:bg-white dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-indigo-500"
            />
            <button
              onClick={() => handleSend()}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md transition-colors hover:bg-blue-700 active:scale-95 focus:outline-none dark:bg-indigo-600 dark:hover:bg-indigo-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-5 w-5 rotate-90"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
