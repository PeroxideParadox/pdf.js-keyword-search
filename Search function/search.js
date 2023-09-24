
let caseNumber = 1; // Initialize the case number

        
function extractTextFromPDF(pdfUrl) {
    return pdfjsLib.getDocument(pdfUrl).promise.then(function (pdf) {
        let text = "";
        const numPages = pdf.numPages;

        function extractPageText(pageNumber) {
            return pdf.getPage(pageNumber).then(function (page) {
                return page.getTextContent().then(function (textContent) {
                    const pageText = textContent.items.map((item) => item.str).join(" ");
                    text += pageText + "\n";
                });
            });
        }

        const pagePromises = [];
        for (let i = 1; i <= numPages; i++) {
            pagePromises.push(extractPageText(i));
        }

        return Promise.all(pagePromises).then(function () {
            return text;
        });
    });
}


function searchPDF(text, keyword, pdfUrl) {
    if (text.toLowerCase().includes(keyword.toLowerCase())) {
        
        const resultsContainer = document.getElementById("pdf-results");

        const pdfContainer = document.createElement("div");
        pdfContainer.className = "pdf-result";

        const downloadLink = document.createElement("a");
        downloadLink.href = pdfUrl;
        downloadLink.download = pdfUrl.split('/').pop(); 

        const pdfIcon = document.createElement("img");
        pdfIcon.src = "dwl.png"; 
        pdfIcon.alt = "PDF Icon";

        downloadLink.appendChild(pdfIcon);

        const caseNumberSpan = document.createElement("span");
        caseNumberSpan.textContent = `Pdf : ${caseNumber}`;

        pdfContainer.appendChild(downloadLink);
        pdfContainer.appendChild(caseNumberSpan);

        resultsContainer.appendChild(pdfContainer);

        caseNumber++; 
    }
}


document.getElementById("search-form").addEventListener("submit", function (e) {
    e.preventDefault();
    const keyword = document.getElementById("search-input").value;

    
    document.getElementById("pdf-results").innerHTML = "";
    caseNumber = 1; 

    //Give path of the pdf Here
    const pdfUrls = [
        "Example1.pdf",
        "Example2.pdf"        //Enter the Path to the PDFS
    ];

    
    pdfUrls.forEach(function (pdfUrl) {
        extractTextFromPDF(pdfUrl).then(function (extractedText) {
            searchPDF(extractedText, keyword, pdfUrl);
        });
    });
});
