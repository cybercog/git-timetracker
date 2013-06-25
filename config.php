<?php

$pathToGitBinary = 'git'; //"git" if the binary is in your $PATH or the complete path e.g. "/usr/bin/git"
$repositoryPath = dirname(__FILE__). '/../../prod/fotosummit'; //Path to the repository
$maxIdleDuration = 3600; // The maximum time difference between two commits. If the difference is more than x seconds, the commits are treated separately
$moneyPerHour = 69;
$currencySymbol = '€';