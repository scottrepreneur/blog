---
title: Shake Light - Tasker
date: 2021-05-22T23:46:37.121Z
template: "post"
draft: false
category: "Automation"
tags:
  - "Tasker"
description: "When you're in a pinch for some light, going through menus is annoying. Get Tasker to turn on your flashlight with a quick flick. Difficulty: 1"
socialImage: { publicUrl: "" }
---

## First off, what is Tasker?

[Tasker](https://play.google.com/store/apps/details?id=net.dinglisch.android.taskerm) is an Android app that allows you to fully customize aspects of the OS experience. Extensions have been built using the Tasker API to automate many aspects of phone & media management. The developer is super responsive to feedback and early on most new ASOP APIs available. When you have a profile active (conditions are met), then tasks are "run" to perform desired updates.

Check out <a href="https://www.androidcentral.com/tasker" target="_blank">Android Central's What is Tasker</a> for a full breakdown.

This is a great starter profile. Difficulty to implement is easy.

## Shake Profile

The shake profile condition has been added by default so adding it is as simple as creating a new Profile and then finding Shake under the Sensor category.

<figure style="width: 240px">
  <img src="/media/sensor_profile.png" alt="Gutenberg">
  <figcaption>Sensor Category Profile Options</figcaption>
</figure>

There are a few options you can set for the shake condition: direction, sensitivity, and duration. For this profile, I used Left-Right direction with medium sensitivity and medium duration. You'll want to tweak it if you experience a decent amount of false triggers or when you attempt a shake and it doesn't register. I get a decent amount of false triggers when I ride my bike but it's pretty good otherwise.

<figure style="width: 240px">
  <img src="/media/shake_options.png" alt="Gutenberg">
  <figcaption>Shake Profile Options</figcaption>
</figure>

Once you've set the Profile you can add a task to toggle the flashlight.

## Toggle Flashlight Task

Head over to the newly created task, give it a name, and select Torch in the Alert category. I've also elected to add a short 100ms vibrate to this task also so that I'm aware when the light might accidentally trigger and can shut it off and not waste too much battery.

<figure style="width: 240px">
  <img src="/media/alert_task.png" alt="Gutenberg">
  <figcaption>Alert Task Category Options</figcaption>
</figure>

### Caveats

I've noticed depending on your battery settings, this won't work with the screen completely off. Turning the lockscreen on is usually enough to wake the sensor. If the fingerprint sensor is within reach I'll flip the lock onto the homescreen prior to shaking.

Check out my version of this [Shake Light Profile here](/media/shake_profile.xml) ("Save Link As", for now).

Let me know if it works for you! Got a suggestion, hit me up.
