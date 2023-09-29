---
template: post
title: Prepping Intel Nuc 10 for Dappnode
description: While not supported out of the box, you can get your NUC 10 running Dappnode with a few simple steps.
callToFeedback: What's your favorite service to run on Dappnode?
category: Dev
date: 2023-02-26T15:16:03.752Z
draft: false
tags:
  - dappnode
  - nuc10
  - vmware

---
Technically the Intel NUCs aren't supported by VMWare for whatever reason, but you need Hypervisor to run the beautiful suite that is [Dappnode](https://dappnode.io).

[https://reddit.com/r/intelnuc/comments/gaf1u4/which\_hypervisor\_type\_1\_is\_supported\_on\_the/](https://reddit.com/r/intelnuc/comments/gaf1u4/which_hypervisor_type_1_is_supported_on_the/)

## Issues Installing Dappnode ISO on NUC 10

The recommendation is to install Dappnode via ISO which works well if the hypervisor is already enabled. You'll get met with a nice GRUB screen if you don't have this, but don't panic we can get your kernel upgraded and off to the races with Dappnode.

It took some searching to narrow down which upgrades were necessary at the kernel level to get things rolling. You'll find that VMWare has provided community support for accessing hypervisor on these NUCs so flashing a quick BIOS update will get it running.
[https://reddit.com/r/intelnuc/comments/gt6gwy/installing\_linux\_on\_nuc\_10/](https://reddit.com/r/intelnuc/comments/gt6gwy/installing_linux_on_nuc_10/)

There's a few solid guides out there for getting ESXi running on your NUC
[https://andrewroderos.com/vmware-esxi-home-lab-intel-nuc-frost-canyon/](https://andrewroderos.com/vmware-esxi-home-lab-intel-nuc-frost-canyon/)

Great guide on the actual install process of ESXi
[https://henvic.dev/posts/homelab/](https://henvic.dev/posts/homelab/)

VMWare engineer provides regular updates about releasesVMWare engineer provides regular updates about releases
[https://williamlam.com/2020/01/esxi-on-10th-gen-intel-nuc-frost-canyon.html](https://williamlam.com/2020/01/esxi-on-10th-gen-intel-nuc-frost-canyon.html)

## Quick breakdown

Here's the steps so you can quickly get back to your Dappnode operations:

1.  Download the ESXi ISO

    a. [vmware.com](http://vmware.com)

    b. Download **vSphere 7.0 Update 1** binaries [https://my.vmware.com/en/web/vmware/evalcenter?p=free-esxi7](https://my.vmware.com/en/web/vmware/evalcenter?p=free-esxi7)

2.  Flash the ISO onto USB drive and boot your NUC with the USB

3.  Install ESXi

4.  Flash Dappnode onto USB and boot NUC with USB to install Dappnode

Good luck out there. Thanks for supporting decentralization and Dappnode.
