import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      trim: true,
    },
    // Media content (images/videos)
    media: {
      layout: {
        type: String,
        enum: [
          "single",
          "twoVertical",
          "twoHorizontal",
          "threeVertical",
          "threeMasonry",
          "fourHorizontal",
          "fourVertical",
          "fourSquare",
          "fiveHorizontal",
          "fiveVertical",
        ],
      },
      files: [
        {
          url: {
            type: String,
            required: true,
          },
          // UPDATED: More flexible type validation
          type: {
            type: String,
            validate: {
              validator: function(v) {
                // Accept either simple types or MIME types
                return v === "image" ||
                       v === "video" ||
                       (typeof v === 'string' && (v.startsWith("image/") || v.startsWith("video/")));
              },
              message: props => `${props.value} is not a valid media type!`
            },
            required: true,
          },
          altText: String,
        },
      ],
    },
    // Post type
    postType: {
      type: String,
      enum: ["post", "event", "article"],
      default: "post",
    },
    // Privacy settings
    privacy: {
      type: String,
      enum: ["Public", "Friends", "Friends except...", "Specific friends"],
      default: "Public",
    },
    // For event posts
    eventDetails: {
      type: {
        type: String,
        enum: ["Online", "In Person"],
      },
      name: String,
      startDate: Date,
      endDate: Date,
      externalLink: String,
      description: String,
      speakers: String,
      timezone: String,
    },
    // For article posts
    articleDetails: {
      title: String,
      content: String,
    },
    // Engagement metrics
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          default: () => new mongoose.Types.ObjectId(),
        },
        text: {
          type: String,
          required: true,
        },
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        parentId: {
          type: mongoose.Schema.Types.ObjectId,
          default: null,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        likes: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          }
        ],
      },
    ],
    // Repost functionality
    isRepost: {
      type: Boolean,
      default: false,
    },
    originalPost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    // Tracking shares
    shares: {
      count: {
        type: Number,
        default: 0,
      },
      users: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
  },
  { timestamps: true }
);

// Create indexes for better query performance
postSchema.index({ user: 1, createdAt: -1 });
postSchema.index({ privacy: 1 });
postSchema.index({ postType: 1 });
postSchema.index({ "likes": 1 });
postSchema.index({ isRepost: 1, originalPost: 1 });

const Post = mongoose.model("Post", postSchema);

export default Post;
