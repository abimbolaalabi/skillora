const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
        return res.status(401).json(
    {
        error: "Authentication required"
    }
    );
    };

    if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
            error: `Only ${allowedRoles.join(" and ")} can access this`
        });
    }

    next();
  };
};

export default roleMiddleware;