import fetch from 'node-fetch';
import FormData from 'form-data';
import { TwitterApi } from 'twitter-api-v2';

/**
 * Platform Poster Utility
 * Handles posting to various social media platforms via their APIs
 */

class PlatformPoster {
    /**
     * Post to X (Twitter)
     * @param {Object} account - Account credentials with OAuth 1.0a tokens
     * @param {Object} content - Post content { text, imageUrl }
     */
    async postToX(account, content) {
        try {
            // Twitter requires OAuth 1.0a with 4 tokens
            // Expected in account: api_key, api_secret, access_token, access_token_secret

            if (!account.api_key || !account.api_secret || !account.access_token || !account.access_token_secret) {
                throw new Error('Missing Twitter OAuth 1.0a credentials. Need: API Key, API Secret, Access Token, Access Token Secret');
            }

            // Initialize Twitter client with OAuth 1.0a
            const client = new TwitterApi({
                appKey: account.api_key,
                appSecret: account.api_secret,
                accessToken: account.access_token,
                accessSecret: account.access_token_secret,
            });

            let mediaId;

            // Upload media if provided
            let imageError = null;
            if (content.imageBuffer) {
                try {
                    console.log(`📤 Uploading image to Twitter: ${content.imageBuffer.length} bytes, type: ${content.imageMimeType}`);

                    // Upload to Twitter
                    mediaId = await client.v1.uploadMedia(content.imageBuffer, { mimeType: content.imageMimeType });
                    console.log('✅ Image uploaded to Twitter, media ID:', mediaId);
                } catch (error) {
                    console.error('❌ Image upload failed:', error);
                    imageError = error.message;
                    // Continue without image
                }
            }

            // Create tweet
            const tweetData = {
                text: content.text
            };

            if (mediaId) {
                tweetData.media = {
                    media_ids: [mediaId]
                };
            }

            console.log('📤 Posting tweet with data:', JSON.stringify(tweetData, null, 2));

            const tweet = await client.v2.tweet(tweetData);

            return {
                success: true,
                postId: tweet.data.id,
                url: `https://twitter.com/${account.username}/status/${tweet.data.id}`,
                imageError: imageError // Will be null if image uploaded successfully
            };

        } catch (error) {
            console.error('Error posting to X:', error);
            return {
                success: false,
                error: error.message || 'Failed to post to Twitter'
            };
        }
    }

    /**
     * Post to LinkedIn
     * @param {Object} account - Account credentials with access_token and platform_user_id
     * @param {Object} content - Post content { text, imageBuffer, imageMimeType, url }
     */
    async postToLinkedIn(account, content) {
        try {
            let media = [];

            // Step 1: Upload image if provided
            if (content.imageBuffer) {
                const assetUrn = await this.uploadMediaToLinkedIn(account.access_token, account.platform_user_id, content.imageBuffer);
                media.push({
                    status: 'READY',
                    description: {
                        text: 'Image'
                    },
                    media: assetUrn,
                    title: {
                        text: 'Image'
                    }
                });
            }

            // Step 2: Create UGC post using v2 API
            const postData = {
                author: `urn:li:person:${account.platform_user_id}`,
                lifecycleState: 'PUBLISHED',
                specificContent: {
                    'com.linkedin.ugc.ShareContent': {
                        shareCommentary: {
                            text: content.text
                        },
                        shareMediaCategory: media.length > 0 ? 'IMAGE' : 'NONE'
                    }
                },
                visibility: {
                    'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
                }
            };

            // Add media if uploaded
            if (media.length > 0) {
                postData.specificContent['com.linkedin.ugc.ShareContent'].media = media;
            }

            const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${account.access_token}`,
                    'Content-Type': 'application/json',
                    'X-Restli-Protocol-Version': '2.0.0'
                },
                body: JSON.stringify(postData)
            });

            const result = await response.json();

            if (!response.ok) {
                console.error('LinkedIn API Error:', result);
                throw new Error(result.message || JSON.stringify(result));
            }

            // Extract post ID from response
            const postId = result.id;
            const postUrl = `https://www.linkedin.com/feed/update/${postId}`;

            return {
                success: true,
                postId: postId,
                url: postUrl
            };

        } catch (error) {
            console.error('Error posting to LinkedIn:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Upload media to LinkedIn using v2 API
     */
    async uploadMediaToLinkedIn(accessToken, platformUserId, imageBuffer) {
        // Step 1: Register upload using v2 API
        const registerData = {
            registerUploadRequest: {
                recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
                owner: `urn:li:person:${platformUserId}`,
                serviceRelationships: [{
                    relationshipType: 'OWNER',
                    identifier: 'urn:li:userGeneratedContent'
                }]
            }
        };

        const registerResponse = await fetch('https://api.linkedin.com/v2/assets?action=registerUpload', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'X-Restli-Protocol-Version': '2.0.0'
            },
            body: JSON.stringify(registerData)
        });

        const registerResult = await registerResponse.json();

        if (!registerResponse.ok) {
            console.error('LinkedIn register upload error:', registerResult);
            throw new Error('Failed to register LinkedIn image upload: ' + JSON.stringify(registerResult));
        }

        const uploadUrl = registerResult.value.uploadMechanism['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'].uploadUrl;
        const asset = registerResult.value.asset;

        // Step 2: Upload image buffer directly
        const uploadResponse = await fetch(uploadUrl, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            body: imageBuffer
        });

        if (!uploadResponse.ok) {
            throw new Error('Failed to upload image to LinkedIn');
        }

        return asset;
    }

    /**
     * Post to Instagram
     * @param {Object} account - Account credentials with access_token and platform_user_id
     * @param {Object} content - Post content { caption, imageUrl, tags }
     */
    async postToInstagram(account, content) {
        try {
            // Prepare caption with hashtags
            let caption = content.caption;
            if (content.tags) {
                const hashtags = content.tags.split(',').map(tag => `#${tag.trim()}`).join(' ');
                caption = `${caption}\n\n${hashtags}`;
            }

            // Step 1: Create media container
            const containerData = new URLSearchParams({
                image_url: content.imageUrl,
                caption: caption,
                access_token: account.access_token
            });

            const containerResponse = await fetch(
                `https://graph.facebook.com/v18.0/${account.platform_user_id}/media`,
                {
                    method: 'POST',
                    body: containerData
                }
            );

            const containerResult = await containerResponse.json();

            if (!containerResponse.ok) {
                throw new Error(containerResult.error?.message || 'Failed to create Instagram container');
            }

            const creationId = containerResult.id;

            // Step 2: Publish the container
            const publishData = new URLSearchParams({
                creation_id: creationId,
                access_token: account.access_token
            });

            const publishResponse = await fetch(
                `https://graph.facebook.com/v18.0/${account.platform_user_id}/media_publish`,
                {
                    method: 'POST',
                    body: publishData
                }
            );

            const publishResult = await publishResponse.json();

            if (!publishResponse.ok) {
                throw new Error(publishResult.error?.message || 'Failed to publish Instagram post');
            }

            return {
                success: true,
                postId: publishResult.id,
                url: `https://www.instagram.com/p/${publishResult.id}`
            };

        } catch (error) {
            console.error('Error posting to Instagram:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Post to Dribbble
     * @param {Object} account - Account credentials with access_token
     * @param {Object} content - Post content { title, description, tags, imageUrl }
     */
    async postToDribbble(account, content) {
        try {
            // Download and prepare image
            const imageResponse = await fetch(content.imageUrl);
            const imageBuffer = await imageResponse.buffer();

            // Create form data
            const formData = new FormData();
            formData.append('title', content.title);

            if (content.description) {
                formData.append('description', content.description);
            }

            if (content.tags) {
                // Dribbble expects comma-separated tags (max 12)
                const tags = content.tags.split(',').map(t => t.trim()).slice(0, 12).join(',');
                formData.append('tags', tags);
            }

            formData.append('image', imageBuffer, { filename: 'shot.jpg' });

            // Post to Dribbble
            const response = await fetch('https://api.dribbble.com/v2/shots', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${account.access_token}`
                },
                body: formData
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to post to Dribbble');
            }

            return {
                success: true,
                postId: result.id,
                url: result.html_url
            };

        } catch (error) {
            console.error('Error posting to Dribbble:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Main post method - routes to appropriate platform
     */
    async post(platform, account, content) {
        switch (platform) {
            case 'X':
                return await this.postToX(account, content);
            case 'LinkedIn':
                return await this.postToLinkedIn(account, content);
            case 'Instagram':
                return await this.postToInstagram(account, content);
            case 'Dribbble':
                return await this.postToDribbble(account, content);
            default:
                return {
                    success: false,
                    error: 'Unsupported platform'
                };
        }
    }
}

export default new PlatformPoster();
