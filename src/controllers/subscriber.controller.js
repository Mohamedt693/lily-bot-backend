import { Subscriber } from "../models/subscriber.model.js";

export const subscribe = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.error("Email is required", 400);

        const newSubscriber = await Subscriber.create({ email });
        return res.success("Subscribed successfully!", newSubscriber, 201);
    } catch (error) {
        if (error.code === 11000) return res.error("You are already subscribed!", 400);
        return res.error("Server error", 500, error);
    }
};