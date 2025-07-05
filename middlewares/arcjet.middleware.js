import aj from "../config/arcjet.js";

const arcjetMiddleware = async (req, res, next) => {
    try {
        //protect my req and what decision arcjet made after that
        const decision = await aj.protect(req, { requested: 1 }); // requested: 1 means we are asking Arcjet to evaluate this request and "spend" 1 token for protection (e.g., for rate limiting, bot detection, etc.)

        if(decision.isDenied()) {
            if(decision.reason.isRateLimit()) {
                return res.status(429).json({ error : "Rate Limit Exceeded" });
            }
            
            if(decision.reason.isBot()) return res.status(403).json({ error: "Bot detected" });

            return res.status(403).json({ error: "Access Denied" });
        }

        next(); //if the decision is not denied then go with the next middleware
    } catch (error) {
        //making sure to know where the err occurs
        console.log(`Arject Middleware Error: ${error}`);
        next(error);
    }
}

export default arcjetMiddleware;