import type { BadgeColor } from "#ui/types";

import {
    Shield,
    Briefcase,
    User as UserIcon,
    Users,
    Gavel,
    Clipboard,
    FileText,
    Medal,
    Heart,
    ShieldCheck,
    Handshake,
    Smile,
    Eye,
    Settings,
    Database,
    LifeBuoy,
    AlertCircle,
    Crown,
    Wallet,
    AlertTriangle,
    Wrench,
    Mars as Male,
    Venus as Female,
} from "lucide-vue-next";
import { z } from "zod";

import type { FormSchema } from "~/types/fields";

// It is used for logging out via gql it can be improved.
export const authContext = () => {
    const authStore = useAuthStore();
    if (!authStore.token) throw new Error("Missing auth token");

    return {
        context: {
            headers: {
                Authorization: `Bearer ${authStore.token}`,
            },
        },
    };
};

export const roleIconMap: Record<string, any> = {
    // ✅ CITY-LEVEL ROLES
    "City Administrator": Briefcase,
    "City Budget Officer": Wallet,
    "City Councilor": Users,
    "City Disaster Risk Officer": AlertTriangle,
    "City Engineer": Wrench,
    "City Health Officer": Heart,
    "City Mayor": Crown,
    "City Planning Officer": Map,
    "City Treasurer": FileText,
    "City Vice Mayor": Crown,

    // ✅ BARANGAY-LEVEL ROLES
    "Barangay Captain": Gavel,
    "Barangay Councilor": Medal,
    "Barangay Health Worker": Heart,
    "Barangay Secretary": Clipboard,
    "Barangay Tanod": ShieldCheck,
    "Barangay Treasurer": FileText,
    "Barangay Volunteer": Handshake,

    // ✅ SK (YOUTH COUNCIL)
    "SK Chairperson": Users,
    "SK Councilor": Users,

    // ✅ REPRESENTATIVES
    "PWD Representative": LifeBuoy,
    "Senior Citizen": Eye,
    "Youth Representative": Smile,

    // ✅ GENERAL ROLES
    Admin: Shield,
    "Data Encoder": Database,
    Guest: AlertCircle,
    Manager: Briefcase,
    Resident: Smile,
    "Social Welfare Officer": Heart,
    "System Administrator": Settings,
    User: UserIcon,
};

export const colorMap: Record<string, BadgeColor> = {
    // ✅ CITY-LEVEL ROLES
    "City Administrator": "emerald",
    "City Budget Officer": "lime",
    "City Councilor": "pink",
    "City Disaster Risk Officer": "amber",
    "City Engineer": "orange",
    "City Health Officer": "green",
    "City Mayor": "red",
    "City Planning Officer": "cyan",
    "City Treasurer": "yellow",
    "City Vice Mayor": "rose",

    // ✅ BARANGAY-LEVEL ROLES
    "Barangay Captain": "red",
    "Barangay Councilor": "amber",
    "Barangay Health Worker": "green",
    "Barangay Secretary": "indigo",
    "Barangay Tanod": "gray",
    "Barangay Treasurer": "yellow",
    "Barangay Volunteer": "teal",

    // ✅ SK (YOUTH COUNCIL)
    "SK Chairperson": "purple",
    "SK Councilor": "purple",

    // ✅ REPRESENTATIVES
    "PWD Representative": "pink",
    "Senior Citizen": "lime",
    "Youth Representative": "cyan",

    // ✅ GENERAL ROLES
    Admin: "emerald",
    "Data Encoder": "blue",
    Guest: "gray",
    Manager: "orange",
    Resident: "sky",
    "Social Welfare Officer": "rose",
    "System Administrator": "emerald",
    User: "blue",
};

export const genderIconMap: Record<string, any> = {
    female: Female,
    male: Male,
};

export const genderColorMap: Record<string, BadgeColor> = {
    female: "pink",
    male: "blue",
};

export function getDocumentStatusColor(
    status: string,
): Record<string, BadgeColor> {
    switch (status?.toLowerCase()) {
        case "approved":
            return { color: "emerald" };
        case "released":
            return { color: "blue" };
        case "expired":
            return { color: "red" };
        case "revoked":
            return { color: "amber" };
        default:
            return { color: "gray" };
    }
}

export function parseGraphQLError(e: any): string {
    const graphQLErrors = e?.graphQLErrors || e?.response?.errors;
    if (Array.isArray(graphQLErrors)) {
        const messages = graphQLErrors.map((error) => {
            const debugMessage = error?.extensions?.debugMessage;
            const message = error?.message;
            return debugMessage || message || "Unknown error";
        });
        messages.forEach((msg) => console.error("GraphQL Error:", msg));

        return messages.join("\n");
    }
    console.error("Unexpected error:", e);

    return "An unexpected error occurred";
}

export const getFriendlyDate = (datetimeStr: string): string => {
    const date = new Date(datetimeStr.replace(" ", "T"));

    const options: Intl.DateTimeFormatOptions = {
        day: "numeric",
        hour: "numeric",
        hour12: true,
        minute: "2-digit",
        month: "long",
        year: "numeric",
    };

    return date.toLocaleString(undefined, options);
};

export const getDateOnly = (datetimeStr: string): string => {
    const date = new Date(datetimeStr.replace(" ", "T"));

    const options: Intl.DateTimeFormatOptions = {
        day: "numeric",
        month: "long",
        year: "numeric",
    };

    return date.toLocaleDateString(undefined, options);
};

export const formatDateAgo = (dateString: string) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;

    return date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

export function formatDateTimeForGraphQL(date: string | Date): string {
    const d = new Date(date);

    const pad = (n: number) => n.toString().padStart(2, "0");

    const year = d.getFullYear();
    const month = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const hours = pad(d.getHours());
    const minutes = pad(d.getMinutes());
    const seconds = pad(d.getSeconds());

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export const toTitleCase = (text: string) => {
    if (!text) return "";
    return text
        .replace(/_/g, " ")
        .split(" ")
        .map(
            (word) =>
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
        )
        .join(" ");
};

export const formZodSchema = (schema: FormSchema) => {
    return z.object(
        schema.fields.reduce(
            (acc, field) => {
                acc[field.name] = field.validation || z.any();
                return acc;
            },
            {} as Record<string, z.ZodTypeAny>,
        ),
    );
};

export function toGraphQLDateTime(input: Date | string | null): string | null {
    if (!input) return null;
    const date = input instanceof Date ? input : new Date(input);
    if (isNaN(date.getTime())) return null;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export const phoneRegex = /^(?:\+63|0)?9\d{9}$/;

// used for OTP
export async function hmacSHA256(otp: string, secret: string): Promise<string> {
    const encoder = new TextEncoder();

    const keyData = encoder.encode(secret);
    const data = encoder.encode(otp);

    const cryptoKey = await crypto.subtle.importKey(
        "raw",
        keyData,
        { hash: "SHA-256", name: "HMAC" },
        false,
        ["sign"],
    );

    const signature = await crypto.subtle.sign("HMAC", cryptoKey, data);

    return Array.from(new Uint8Array(signature))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
}

export function generateCustomId(text: string, date = new Date()) {
    const d = new Date(date);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    const seconds = String(d.getSeconds()).padStart(2, "0");

    const timestamp = `${year}${month}${day}${hours}${minutes}${seconds}`;

    return `${text}-${timestamp}`;
}
