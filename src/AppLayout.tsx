
import { Outlet } from 'react-router-dom'
import Header from './components/Header/Header'

const AppLayout = () => {
    return (
        <div className='min-h-screen relative bg-slate-300'>
            <Header />
            <Outlet />
        </div>
    )
}

export default AppLayout