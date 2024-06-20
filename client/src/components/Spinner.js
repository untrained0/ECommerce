import React from 'react'

function Spinner() {
  return (
    <div className='fixed inset-0 bg-black z-[9999] flex items-center justify-center opacity-50 '>
    <div className='w-10 h-10 border-3 border-solid border-white border-t-transparent rounded-full animate-spin '>

    </div>
    </div>
  )
}

export default Spinner