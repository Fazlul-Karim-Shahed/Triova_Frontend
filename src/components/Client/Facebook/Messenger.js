"use client";
import { useEffect } from "react";
import { FloatingWhatsApp } from "react-floating-whatsapp";

export default function MessengerChat() {
    // useEffect(() => {
    //     console.log("[MessengerChat] Component mounted");
    //     const checkFB = () => {
    //         if (window.FB) {
    //             console.log("[MessengerChat] FB SDK is loaded");
    //             window.FB.XFBML.parse();
    //         } else {
    //             console.log("[MessengerChat] FB not ready yet, retrying...");
    //             setTimeout(checkFB, 1000);
    //         }
    //     };
    //     checkFB();
    // }, []);

    return (
        // <div
        //     id="fb-customer-chat"
        //     className="fb-customerchat"
        //     page_id="747421228445481"
        //     attribution="biz_inbox"
        //     theme_color="#0084FF"
        //     logged_in_greeting="Hi! How can we help?"
        //     logged_out_greeting="Please log in to chat."
        // />

        <FloatingWhatsApp phoneNumber={"+8801521537962"} accountName={"Triova"} allowEsc key="whatsapp" chatMessage={"Hello sir! \nWelcome to Triova 🤝 \n\nHow can I help you?"} />
    );
}
