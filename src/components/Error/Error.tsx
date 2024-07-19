import { CircleAlert } from 'lucide-react'

const Error = ({ message }: { message: string }) => {
    return (
        <div className='text-red-600 text-sm flex items-center gap-2'><CircleAlert /> {message}</div>
    )
}

export default Error