ipfs config Addresses.Gateway /ip4/127.0.0.1/tcp/8082
ipfs config Addresses.API /ip4/127.0.0.1/tcp/5002
#ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin "[\"*\"]"
#ipfs config --json API.HTTPHeaders.Access-Control-Allow-Credentials "[\"true\"]"
#ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["http://127.0.0.1:5002", "https://webui.ipfs.io"]'
#ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["PUT", "GET", "POST"]'
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Credentials '["true"]'
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["*"]'
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["GET", "POST"]'
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Headers '["Authorization"]'
ipfs config --json API.HTTPHeaders.Access-Control-Expose-Headers '["Location"]'
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Credentials '["true"]'

ipfs daemon --manage-fdlimit

# Update your .bash_profile with to export the path to IPFS Storage
#export IPFS_PATH=~/storage/ipfs