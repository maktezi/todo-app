export function copyToClipboard(text: string, row: string) {
    const toast = useToast();

    navigator.clipboard.writeText(row);
    toast.add({
        color: "blue",
        icon: "solar:check-circle-broken",
        title: `Copied ${row} to clipboard`,
    });
}
