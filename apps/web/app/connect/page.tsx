// ChatPage.tsx

type Message = {
  id: number;
  text: string;
  sender: "me" | "other";
};

const Page = () => {
  const messages = [
    {
      id: "123",
      sender: "Anshul",
      text: "jasdahdk",
    },
    {
      id: "123",
      sender: "Anshul",
      text: "jasdahdk",
    },
    {
      id: "123",
      sender: "me",
      text: "jasdahdk",
    },
  ];
  return (
    <div className='min-h-screen bg-gray-900 relative text-white flex flex-col'>
      <div className='flex-1 justify-between p-4 overflow-y-auto space-y-3'>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-xs w-auto flex px-4 py-2 rounded-2xl ${
              msg.sender === "me"
                ? "bg-green-600 ml-auto text-right"
                : "bg-gray-700 mr-auto"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className='p-4 border-t w-full border-gray-700 flex gap-2 fixed bottom-0 bg-gray-800'>
        <input
          type='text'
          className='flex-1 px-4 py-2 rounded-md text-black'
          placeholder='Type your message...'
        />
        <button className='bg-green-600 px-4 py-2 rounded-md hover:bg-green-700'>
          Send
        </button>
      </div>
    </div>
  );
};

export default Page;
