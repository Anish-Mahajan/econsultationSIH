const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const validator = require('validator');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware with proper CSP for the application
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"], // Allow inline styles
            scriptSrc: ["'self'", "'unsafe-inline'"], // Allow inline scripts
            scriptSrcAttr: ["'self'", "'unsafe-inline'"], // Allow inline event handlers
            imgSrc: ["'self'", "data:", "https:"],
            fontSrc: ["'self'", "https:", "data:"],
            connectSrc: ["'self'"],
            frameSrc: ["'none'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            childSrc: ["'none'"]
        }
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// CORS configuration
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://your-domain.com'] 
        : ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Add request logging for debugging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

const MONGODB_URI = process.env.MONGODB_URI || 
    "mongodb+srv://anishkm16:anish2004@cluster0.llzwz93.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose
    .connect(MONGODB_URI, {
        dbName: "econsultation",
    })
    .then(() => {
        console.log("✅ Connected to MongoDB Atlas");
    })
    .catch((error) => {
        console.error("❌ MongoDB connection error:", error.message);
        process.exit(1);
    });

// Comment Schema
const commentSchema = new mongoose.Schema({
    stakeholderName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    stakeholderEmail: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate: [validator.isEmail, 'Invalid email address']
    },
    organization: {
        type: String,
        trim: true,
        maxlength: 200
    },
    stakeholderType: {
        type: String,
        required: true,
        enum: ['Individual', 'Company', 'Professional Body', 'Industry Association', 'NGO', 'Academic Institution', 'Government Agency', 'Other']
    },
    documentTitle: {
        type: String,
        required: true,
        trim: true,
        maxlength: 300
    },
    commentType: {
        type: String,
        required: true,
        enum: ['General Comment', 'Specific Provision', 'Addition Suggestion', 'Deletion Suggestion', 'Modification Suggestion']
    },
    sectionReference: {
        type: String,
        trim: true,
        maxlength: 100
    },
    commentText: {
        type: String,
        required: true,
        trim: true,
        maxlength: 5000
    },
    rationale: {
        type: String,
        trim: true,
        maxlength: 3000
    },
    submissionDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        default: 'submitted',
        enum: ['submitted', 'under_review', 'reviewed', 'processed']
    },
    ipAddress: {
        type: String,
        required: true
    },
    userAgent: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

// Create indexes for better query performance
commentSchema.index({ documentTitle: 1, submissionDate: -1 });
commentSchema.index({ stakeholderEmail: 1 });
commentSchema.index({ status: 1 });

const Comment = mongoose.model('Comment', commentSchema);

// Input validation middleware
const validateCommentInput = (req, res, next) => {
    console.log('Validating comment input:', req.body);
    
    const { stakeholderName, stakeholderEmail, stakeholderType, documentTitle, commentType, commentText } = req.body;
    
    const errors = [];
    
    // Required field validation
    if (!stakeholderName || stakeholderName.trim().length === 0) {
        errors.push('Stakeholder name is required');
    }
    
    if (!stakeholderEmail || !validator.isEmail(stakeholderEmail)) {
        errors.push('Valid email address is required');
    }
    
    if (!stakeholderType || !['Individual', 'Company', 'Professional Body', 'Industry Association', 'NGO', 'Academic Institution', 'Government Agency', 'Other'].includes(stakeholderType)) {
        errors.push('Valid stakeholder type is required');
    }
    
    if (!documentTitle || documentTitle.trim().length === 0) {
        errors.push('Document title is required');
    }
    
    if (!commentType || !['General Comment', 'Specific Provision', 'Addition Suggestion', 'Deletion Suggestion', 'Modification Suggestion'].includes(commentType)) {
        errors.push('Valid comment type is required');
    }
    
    if (!commentText || commentText.trim().length === 0) {
        errors.push('Comment text is required');
    } else if (commentText.length > 5000) {
        errors.push('Comment text must be less than 5000 characters');
    }
    
    // Length validations
    if (stakeholderName && stakeholderName.length > 100) {
        errors.push('Name must be less than 100 characters');
    }
    
    if (req.body.organization && req.body.organization.length > 200) {
        errors.push('Organization name must be less than 200 characters');
    }
    
    if (req.body.sectionReference && req.body.sectionReference.length > 100) {
        errors.push('Section reference must be less than 100 characters');
    }
    
    if (req.body.rationale && req.body.rationale.length > 3000) {
        errors.push('Rationale must be less than 3000 characters');
    }
    
    if (errors.length > 0) {
        console.log('Validation errors:', errors);
        return res.status(400).json({
            success: false,
            error: 'Validation failed',
            details: errors
        });
    }
    
    console.log('Validation passed');
    next();
};

// API Routes

// Submit a new comment
app.post('/api/comments', validateCommentInput, async (req, res) => {
    console.log('POST /api/comments - Received request');
    console.log('Request body:', req.body);
    
    try {
        const commentData = {
            ...req.body,
            ipAddress: req.ip || req.connection.remoteAddress || 'unknown',
            userAgent: req.get('User-Agent') || 'Unknown'
        };
        
        console.log('Creating comment with data:', commentData);
        
        const comment = new Comment(commentData);
        const savedComment = await comment.save();
        
        console.log('✅ Comment saved successfully:', savedComment._id);
        
        res.status(201).json({
            success: true,
            message: 'Comment submitted successfully',
            commentId: savedComment._id
        });
        
    } catch (error) {
        console.error('❌ Error saving comment:', error);
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                error: 'Validation error',
                details: Object.values(error.errors).map(err => err.message)
            });
        }
        
        res.status(500).json({
            success: false,
            error: 'Failed to submit comment. Please try again later.'
        });
    }
});

// Get all comments (for testing/admin purposes)
app.get('/api/comments', async (req, res) => {
    try {
        const comments = await Comment.find()
            .sort({ createdAt: -1 })
            .limit(100); // Limit to latest 100 comments
        
        res.json({
            success: true,
            count: comments.length,
            comments: comments
        });
    } catch (error) {
        console.error('❌ Error fetching comments:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch comments'
        });
    }
});

// Get comments by document
app.get('/api/comments/:documentTitle', async (req, res) => {
    try {
        const { documentTitle } = req.params;
        const comments = await Comment.find({ 
            documentTitle: new RegExp(documentTitle, 'i') 
        }).sort({ createdAt: -1 });
        
        res.json({
            success: true,
            document: documentTitle,
            count: comments.length,
            comments: comments
        });
    } catch (error) {
        console.error('❌ Error fetching comments by document:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch comments'
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        status: 'healthy',
        timestamp: new Date().toISOString(),
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

// Test endpoint to check if API is working
app.get('/api/test', (req, res) => {
    res.json({
        success: true,
        message: 'API is working!',
        timestamp: new Date().toISOString()
    });
});

// Serve the main HTML file for root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'API route not found'
    });
});

// 404 handler for other routes - serve index.html for client-side routing
app.use('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Global error handler
app.use((error, req, res, next) => {
    console.error('❌ Unhandled error:', error);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('🔄 Received SIGTERM, shutting down gracefully...');
    await mongoose.connection.close();
    process.exit(0);
});

process.on('SIGINT', async () => {
    console.log('🔄 Received SIGINT, shutting down gracefully...');
    await mongoose.connection.close();
    process.exit(0);
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌐 Access the application at: http://localhost:${PORT}`);
    console.log(`📊 API endpoints available at: http://localhost:${PORT}/api/`);
    console.log(`🔍 Test API at: http://localhost:${PORT}/api/test`);
    console.log(`📝 View comments at: http://localhost:${PORT}/api/comments`);
});

module.exports = app;