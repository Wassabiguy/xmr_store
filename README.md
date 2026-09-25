# What is Xmr store?
Basically it's a Telegram botshotp can be used to sell or buy the items you list in it, what makes it special is that it uses Monero as a payment method

# Bot features
[✅] Simple UI

[✅] Generates a QR code when checking out so it can make paying easy just by scanning it from your wallet

[✅] A cron job to inform the customer that the payment were detected.

[✅] Can check if the customer paid fully,partially or not at all

[✅] Admin panel & more...

# How can we make it work on our machine?

# 1 - Spin the Monero-wallet-rpc on

Provided that you have your wallet file which is an output made from the official monero desktop wallet, we will have  a file that ends with '.keys' once we have that we can now start our wallet rpc in order to do a local api calls, in order to start it we must navigate to the executable file named 'monero-wallet-rpc' and the enter the following command.
`./monero-wallet-rpc --rpc-bind-port PORT --disable-rpc-login --log-level 2 --wallet-file
PATH_TO_FILE_THAT_END_WITH_.keys --prompt-for-password
`
If you want to use a remote node you must add the flag  `--daemon-address node.moneroworld.com:18089`
make sure to replace words with a fully capital letter with the needed arguments, 