const express = require("express");
const axios = require("axios");
const app = express();
const port = 3001;
const SOCIAL_MEDIA_API = "";
const fetchPostsData = async () => {
    try {
        const response = await axios.get(`${SOCIAL_MEDIA_API}/posts`);
        return response.data;
    } catch (error) {
        console.error("Error fetching posts:", error);
        return [];
    }
}
app.get("/users", async (req, res) => {
const posts = await fetchPostsData();
  
const userPostCounts = posts.reduce((acc, post) => {
        acc[post.userId] = (acc[post.userId] || 0) + 1;
        return acc;
    }, {});

    const topUsers = Object.entries(userPostCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([userId, count]) => ({ userId, postCount: count }));

    res.json(topUsers);
})


app.get("/posts", async (req, res) => {
    const { type }=req.query;
    const posts=await fetchPostsData();
    if (type === "latest") {
        const latestPosts = posts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 5);
        return res.json(latestPosts);
    } else if (type === "popular") {
        const commentCounts = {};
        const comments = await axios.get(`${SOCIAL_MEDIA_API}/comments`).then(res => res.data).catch(() => []);

        comments.forEach(comment => {
            commentCounts[comment.postId] = (commentCounts[comment.postId] || 0) + 1;
        });

        const popularPosts = posts
            .map(post => ({ ...post, commentCount: commentCounts[post.id] || 0 }))
            .sort((a, b) => b.commentCount - a.commentCount)
            .filter(post => post.commentCount > 0);

        return res.json(popularPosts);
    }
    
    res.status(400).json({ error: "Invalid type parameter. Use 'latest' or 'popular'." });
})
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});