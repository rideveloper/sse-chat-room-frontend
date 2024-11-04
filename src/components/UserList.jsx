import PropTypes from 'prop-types';

export function UserList({ users, currentUser }) {
    return (
        <div className="w-48 border-l p-4 hidden md:block">
            <h3 className="font-medium mb-2">Online Users ({users.length})</h3>
            <div className="space-y-1">
                {users.map(user => (
                    <div
                        key={user}
                        className={`text-sm p-2 rounded ${
                            user === currentUser ? "bg-blue-50" : ""
                        }`}
                    >
                        {user}
                    </div>
                ))}
            </div>
        </div>
    );
}

UserList.propTypes = {
    users: PropTypes.arrayOf(PropTypes.string).isRequired,
    currentUser: PropTypes.string.isRequired
};

UserList.defaultProps = {
    users: []
};