import ChatMessages from "../../../components/ChatMessages";

const Page = () => {
  return (
    <div className='min-h-screen bg-gray-900 relative text-white flex flex-col'>
      <ChatMessages />
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
