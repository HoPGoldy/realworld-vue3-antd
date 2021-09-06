export default function setDocumentTitle (title: string | undefined): void {
    const pageTitle = title ? title + ' — ' : '';
    const documentTitle = pageTitle + 'Conduit';
    window.document.title = documentTitle;
}