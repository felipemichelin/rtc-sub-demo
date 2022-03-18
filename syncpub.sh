#aws s3 --profile burnerdomain sync ./public_site/build/ s3://teststack-buck6f4d3e52-1k7lalnsmr2dh

aws s3 --profile burnerdomain sync --exclude "*.zip" --exclude "$0" --exclude ".git/*" build/ s3://burnerdomain-substacknes-subwebsitesubwebsitebuck-22a4yob1omui/
aws cloudfront --profile burnerdomain create-invalidation --distribution-id E1JOGZ4PCESQE6 --paths '/*'
