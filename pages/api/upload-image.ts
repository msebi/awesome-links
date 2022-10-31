import aws from 'aws-sdk'

const handler = async (req, res) => {
    try {
        // TODO: rem. Trigger rebuild 2
        // 1.
        const s3 = new aws.S3({
            accessKeyId: process.env.PROJECT_AWS_ACCESS_KEY,
            secretAccessKey: process.env.PROJECT_AWS_SECRET_KEY,
            region: process.env.PROJECT_AWS_REGION,
        })

        // 2.
        aws.config.update({
            accessKeyId: process.env.PROJECT_AWS_ACCESS_KEY,
            secretAccessKey: process.env.PROJECT_AWS_SECRET_KEY,
            region: process.env.PROJECT_AWS_REGION,
            signatureVersion: 'v4',
        })

        // 3.
        const post = await s3.createPresignedPost({
            Bucket: process.env.REACT_APP_NEXT_PUBLIC_AWS_S3_BUCKET_NAME,
            Fields: {
                key: req.query.file,
            },
            Expires: 60, // seconds
            Conditions: [
                ['content-length-range', 0, 5048576], // up to 1 MB
            ],
        })

        // 4.
        return res.status(200).json(post)
    }
    catch (error) {
        console.error(error)
    }
}

export default handler;