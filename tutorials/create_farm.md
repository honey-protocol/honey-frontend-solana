# How to add an NFT farm to Honey Finance

Honey Finance allows for permissionless NFT staking. It uses the Gem Farm staking standard developed by @ilmoi .

## Step 1 : Create a gem-farm

Creating an NFT staking farm is quite simple with gem-farm. You can create using the gem-farm GUI. https://www.gemfarm.gg/manager

Please make sure to carefully review the gem-farm's documentation before creating a farm.

*NOTE: Only "vanilla" farms can be added to Honey's UI. This means modified gem-farm / gem-works programs cannot be added.*

### Recommended tutorials

- https://docs.gemworks.gg/gem-farm/video-walkthrough
- https://youtu.be/EHbqxO61JVs (Solandy)

Once deployed, keep note of your gem-farm and gem-bank addresses.

## Step 2 : Fork Honey's Solana interface

1. Navigate to our open source [repo](https://github.com/honey-protocol/honey-frontend-solana).

2. Click the 'Fork' button in the top right corner.

3. Open the `new-farms.tsx` [file](https://github.com/honey-protocol/honey-frontend-solana/blob/release/redesign/constants/new-farms.tsx) in the IDE / text editor of your choice.

4. Complete your farm's information:

!Be careful to respect data types.

Add the following example to `new-farm.tsx` and complete it with your collection's information.

```
  {
    id: '<PICK_YOUR_ID>',
    imageUrl: 'https://i.imgur.com/<YOUR_IMAGE_HERE>.png',
    name: '<TITLE_OF_YOUR_COLLECTION)',
    totalStaked: '???',
    totalNumber: <SIZE_OF_YOUR_COLLECTION>,
    allocation: '<ESTIMATED_DAILY_EMISSION_PER_NFT>',
    totalStakedByUser: '-',
    eventStartDate: '2022-03-30T18:50Z ',
    eventDuration: '∞',
    updateAuthority: '<YOUR_COLLECTION_UPDATE_AUTH>',
    rewardTokenName: '<NAME_OF_MAIN_REWARD_TOKEN>',
    farmAddress: '<YOUR_GEM_FARM_ADDRESS>',
    bankAddress: '<YOUR_GEM_BANK_ADDRESS>'
  },
```

## Step 3 : Make a pull request with your changes to the honey-frontend-solana master branch 

Navigate to your newly forked repo of honey-frontend-solana on GitHub and select **pull request**. Pick **new pull requests**.

You will then need to select honey's master branch as the *base repository*, and your own as *head repository*.

Below you should see your own changes in green, highlighting your newly created farm.

You can then click **create pull request**, which will notify the core team about your changes. If you have done everything correctly, they should be approved within 48 hours.