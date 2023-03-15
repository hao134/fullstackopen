const Notification = ({ notification }) => {
    if (notification === null) return null

    if (notification.includes('error')) {
        return <div className="error">{notification}</div>
    }
    return <div className="success">{notification}</div>
}

export default Notification