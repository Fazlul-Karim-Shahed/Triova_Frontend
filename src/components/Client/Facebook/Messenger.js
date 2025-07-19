
"use client";

import React from "react";
import { FacebookProvider, CustomChat } from "react-facebook";

export default function Messenger() {
    return (
        <FacebookProvider appId="361765999937307" chatSupport>
            <CustomChat pageId="747421228445481" minimized={false} />
        </FacebookProvider>
    );
}
