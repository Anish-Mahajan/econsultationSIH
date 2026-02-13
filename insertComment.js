const mongoose = require('mongoose');

// MongoDB connection string
const MONGODB_URI = "mongodb+srv://anishkm16:anish2004@cluster0.llzwz93.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Comment Schema (same as your server.js)
const commentSchema = new mongoose.Schema({
    stakeholderName: { type: String, required: true, trim: true, maxlength: 100 },
    stakeholderEmail: { type: String, required: true, trim: true, lowercase: true },
    organization: { type: String, trim: true, maxlength: 200 },
    stakeholderType: { type: String, required: true, enum: ['Individual', 'Company', 'Professional Body', 'Industry Association', 'NGO', 'Academic Institution', 'Government Agency', 'Other'] },
    documentTitle: { type: String, required: true, trim: true, maxlength: 300 },
    commentType: { type: String, required: true, enum: ['General Comment', 'Specific Provision', 'Addition Suggestion', 'Deletion Suggestion', 'Modification Suggestion'] },
    sectionReference: { type: String, trim: true, maxlength: 100 },
    commentText: { type: String, required: true, trim: true, maxlength: 5000 },
    rationale: { type: String, trim: true, maxlength: 3000 },
    submissionDate: { type: Date, default: Date.now },
    status: { type: String, default: 'submitted', enum: ['submitted', 'under_review', 'reviewed', 'processed'] },
    ipAddress: { type: String, required: true },
    userAgent: { type: String, required: true }
}, { timestamps: true });

const Comment = mongoose.model('Comment', commentSchema);

// Sample comments data
const sampleComments = [

    {
        stakeholderName: "Priya Sharma",
        stakeholderEmail: "priya.sharma@techcorp.in",
        organization: "TechCorp Solutions Pvt Ltd",
        stakeholderType: "Company",
        documentTitle: "Draft Companies (Amendment) Rules, 2024",
        commentType: "Modification Suggestion",
        sectionReference: "Rule 15(2)",
        commentText: "The current compliance timeline of 30 days is unrealistic for medium-sized companies. We propose extending it to 60 days to allow proper documentation and internal approvals. This will reduce non-compliance issues and improve overall adherence to regulations.",
        rationale: "Our internal analysis shows that medium companies typically require 45-50 days for complete compliance documentation, considering approval hierarchies and technical implementations.",
        ipAddress: "192.168.1.101",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    },
    {
        stakeholderName: "Dr. Anjali Verma",
        stakeholderEmail: "secretary@icai-delhi.org",
        organization: "Institute of Chartered Accountants of India",
        stakeholderType: "Professional Body",
        documentTitle: "Draft Companies (Amendment) Rules, 2024",
        commentType: "Specific Provision",
        sectionReference: "Section 8(1)(a) and Rule 12",
        commentText: "While we appreciate the government's effort to streamline corporate governance through these amendments, several provisions require careful reconsideration. Section 8(1)(a) introduces mandatory digital filing requirements which, although beneficial for transparency, may pose significant challenges for smaller firms lacking adequate technological infrastructure. The proposed penalty structure in Rule 12 appears disproportionately harsh for first-time violations, particularly for entities with turnover below Rs. 10 crores. We suggest implementing a graded penalty system with warnings for initial violations and reduced penalties for prompt rectification. Additionally, the requirement for quarterly compliance reports may overwhelm smaller practices and could lead to increased compliance costs.",
        rationale: "Based on feedback from over 500 member firms across India, we've identified that 60% of small and medium practices lack the resources for quarterly digital compliance. The current penalty structure could result in business closures rather than improved compliance. A phased implementation approach with capacity-building support would be more effective in achieving the intended regulatory objectives while maintaining business viability.",
        ipAddress: "192.168.1.102",
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
    },
    {
        stakeholderName: "Prof. Vikram Singh",
        stakeholderEmail: "vikram.singh@delhilaw.edu",
        organization: "Delhi Law University",
        stakeholderType: "Academic Institution",
        documentTitle: "Draft Companies (Amendment) Rules, 2024",
        commentType: "Addition Suggestion",
        commentText: "Consider adding a provision for academic research exemptions in data disclosure requirements.",
        rationale: "This would facilitate better corporate governance research without compromising business confidentiality.",
        ipAddress: "192.168.1.103",
        userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36"
    },
    {
        stakeholderName: "Meena Patel",
        stakeholderEmail: "policy@cii.in",
        organization: "Confederation of Indian Industry",
        stakeholderType: "Industry Association",
        documentTitle: "Draft Companies (Amendment) Rules, 2024",
        commentType: "General Comment",
        commentText: "The draft amendments demonstrate a progressive approach to corporate governance. The emphasis on ESG compliance aligns well with global best practices and will enhance India's investment attractiveness. The simplified reporting formats will reduce administrative burden while maintaining transparency standards. We particularly appreciate the flexibility provided for startups and emerging businesses.",
        rationale: "Industry consultation with 200+ member companies revealed strong support for these reforms. The phased implementation timeline allows adequate preparation, and the digital-first approach will improve efficiency and reduce paperwork significantly.",
        ipAddress: "192.168.1.104",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    },
    {
        stakeholderName: "Suresh Agarwal",
        stakeholderEmail: "suresh.agarwal@manufacturinginc.com",
        organization: "Agarwal Manufacturing Inc",
        stakeholderType: "Company",
        documentTitle: "Draft Companies (Amendment) Rules, 2024",
        commentType: "Deletion Suggestion",
        sectionReference: "Rule 18(3)(b)",
        commentText: "We strongly oppose the mandatory appointment of independent directors for companies with paid-up capital exceeding Rs. 5 crores, as proposed in Rule 18(3)(b). This requirement will create unnecessary financial burden on growing businesses and may not add substantial value to governance in family-owned enterprises. The current threshold of Rs. 10 crores is more appropriate and should be maintained. Furthermore, the proposed timeline for implementation is too aggressive, giving companies insufficient time to identify, evaluate, and onboard suitable independent directors. The definition of 'independence' itself needs clarification, as the current criteria may disqualify many qualified candidates due to overly restrictive relationship clauses. We request deletion of this provision or, alternatively, maintaining the existing threshold with extended implementation timeline and revised independence criteria.",
        rationale: "Based on industry data from 150 manufacturing companies in our network, the Rs. 5 crore threshold will affect approximately 70% of mid-size manufacturers who are already struggling with post-pandemic recovery. The additional cost of independent director remuneration, insurance, and compliance could range from Rs. 8-15 lakhs annually, significantly impacting profitability. Many family businesses operate efficiently with existing governance structures, and forced addition of external directors may disrupt established decision-making processes without clear benefits.",
        ipAddress: "192.168.1.105",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    },
    {
        stakeholderName: "Rita Joshi",
        stakeholderEmail: "director@transparencywatch.org",
        organization: "Transparency Watch India",
        stakeholderType: "NGO",
        documentTitle: "Draft Companies (Amendment) Rules, 2024",
        commentType: "General Comment",
        commentText: "These amendments will significantly improve corporate transparency and accountability.",
        rationale: "Enhanced disclosure requirements will benefit public interest and investor protection.",
        ipAddress: "192.168.1.106",
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
    },
    {
        stakeholderName: "K.R. Nair",
        stakeholderEmail: "kr.nair@rbi.gov.in",
        organization: "Reserve Bank of India",
        stakeholderType: "Government Agency",
        documentTitle: "Draft Companies (Amendment) Rules, 2024",
        commentType: "Modification Suggestion",
        sectionReference: "Section 12",
        commentText: "The proposed amendments to Section 12 regarding foreign investment reporting are comprehensive but may create overlapping requirements with existing RBI regulations. We suggest harmonizing these requirements to avoid duplicate reporting by companies. The quarterly reporting frequency is appropriate, but the format should align with existing FEMA compliance requirements to reduce regulatory burden.",
        rationale: "Coordination between MCA and RBI reporting will eliminate redundancy and improve compliance efficiency. Currently, companies face multiple reporting obligations for similar information, which increases costs without adding regulatory value.",
        ipAddress: "192.168.1.107",
        userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36"
    },
    {
        stakeholderName: "Advocate Raman Krishnan",
        stakeholderEmail: "president@barcouncilindia.org",
        organization: "Bar Council of India",
        stakeholderType: "Professional Body",
        documentTitle: "Draft Companies (Amendment) Rules, 2024",
        commentType: "General Comment",
        commentText: "The Legal Affairs Committee of the Bar Council of India has reviewed the proposed amendments and finds them to be a significant step forward in modernizing India's corporate legal framework. The provisions relating to alternative dispute resolution mechanisms are particularly commendable and align with our long-standing advocacy for reducing litigation burden on courts. The introduction of mandatory mediation clauses for corporate disputes below Rs. 2 crores will expedite resolution while reducing costs for all parties involved. The enhanced disclosure requirements for related party transactions will strengthen corporate governance and provide better protection for minority shareholders. We also appreciate the clarification provided regarding director liability limitations, which will encourage qualified professionals to accept board positions without fear of excessive personal exposure. The phased implementation approach demonstrates thoughtful policy-making that considers practical challenges faced by the corporate sector.",
        rationale: "Our analysis, conducted in consultation with over 100 corporate lawyers across major cities, indicates that these amendments address key pain points in current corporate law practice. The alternative dispute resolution provisions alone could reduce corporate litigation by an estimated 30-40%, freeing up judicial resources for more complex matters. The liability protection measures will improve board quality by attracting qualified independent directors who previously avoided such roles due to unlimited liability concerns.",
        ipAddress: "192.168.1.108",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    },
    {
        stakeholderName: "Amit Gupta",
        stakeholderEmail: "amit.gupta87@yahoo.com",
        stakeholderType: "Individual",
        documentTitle: "Draft Companies (Amendment) Rules, 2024",
        commentType: "Deletion Suggestion",
        sectionReference: "Rule 25",
        commentText: "Rule 25 regarding mandatory digital signatures is problematic for senior citizens and should be removed.",
        rationale: "Many elderly stakeholders lack technical knowledge and may be excluded from the consultation process.",
        ipAddress: "192.168.1.109",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    }
];

async function insertSampleComments() {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI, {
            dbName: "econsultation",
        });
        console.log("✅ Connected to MongoDB Atlas");

        // Insert all comments
        const result = await Comment.insertMany(sampleComments);
        console.log(`✅ Successfully inserted ${result.length} comments`);
        
        // Display inserted comment IDs
        result.forEach((comment, index) => {
            console.log(`Comment ${index + 1}: ${comment._id} - ${comment.stakeholderName}`);
        });

    } catch (error) {
        console.error("❌ Error inserting comments:", error);
    } finally {
        // Close connection
        await mongoose.connection.close();
        console.log("🔌 Database connection closed");
    }
}

// Run the insertion
insertSampleComments();


/*
{
    stakeholderName: "Neha Kapoor",
    stakeholderEmail: "neha.kapoor@greengrowth.org",
    organization: "Green Growth Foundation",
    stakeholderType: "NGO",
    documentTitle: "Draft Companies (Amendment) Rules, 2024",
    commentType: "General Comment",
    commentText: "The amendments reflect a strong commitment towards sustainable corporate governance. The focus on ESG reporting and simplified compliance procedures will not only improve transparency but also encourage companies to adopt environmentally responsible practices. This is a progressive step that aligns with international best standards.",
    rationale: "Our consultations with multiple NGOs and corporate sustainability experts show overwhelming support for ESG integration. Simplified compliance reduces administrative overhead and allows businesses to focus more on impactful CSR activities.",
    ipAddress: "192.168.1.120",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
}


*/