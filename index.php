<?php

require(dirname(__FILE__) . '/config.php');
require(dirname(__FILE__) . '/php-git/Git.php');

Git::set_bin($pathToGitBinary);
$repo = Git::open($repositoryPath);

if ($repo->test_git() === false) {
	throw new Exception('Git is not installed in "' . $pathToGitBinary . '". Please update the path in config.php');
}

$log = $repo->log("%H - %ad: %s");
$log = preg_split ('/$\R?^/m', $log);

$i = 0;
foreach($log as $line) {
	//902a2a161048582a21fefddf2d4ac29461a64e57 - Tue Jun 25 17:52:42 2013 +0200: Workshop Daten vereinheitlicht
	if (preg_match('/([a-z0-9]{40}) - (.*?): (.*)/i', $line, $matches)) {
		$data[] = array(
			'id' => $i++,
			'hash' => $matches[1],
			'date' => strtotime($matches[2]),
			'message' => $matches[3],
		);
	} else {
		die('Could not parse line "' . $line . '"');
	}
}

?><!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8"/>
		<title>Billing for <?php echo $repositoryPath; ?></title>

		<link href="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.2/css/bootstrap-combined.min.css" rel="stylesheet">
		<style>
			#commits {
				margin-bottom: 6px;
			}

			#commits .date label {
				font-weight: bold;
			}
		</style>

		<script>
			var maxIdleDuration = <?php echo $maxIdleDuration; ?> * 1000;
			var moneyPerSecond = <?php echo $moneyPerHour/3600; ?>;
			var currencySymbol = '<?php echo $currencySymbol; ?>';
		</script>
	</head>
	<body>
		<div class="container">
			<h1>Billing for <?php echo realpath($repositoryPath); ?></h1>
			<div id="billing"></div>
			<p>
				<button id="calculate" class="btn btn-primary">Calculate</button>
			</p>
			<form>
				<?php foreach ($data as $commit): ?>
					<div class="row" id="commits">
						<div class="span3 date">
							<label>
								<input type="checkbox" data-id="<?php echo $commit['id']; ?>" data-date="<?php echo $commit['date']; ?>" data-message="<?php echo $commit['message']; ?>">
								<?php echo date('d.m.Y H:i:s', $commit['date']); ?>
							</label>
						</div>
						<div class="span9 message"><?php echo $commit['message']; ?></div>
					</div>
				<?php endforeach; ?>
			</form>
		</div>

		<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/2.0.2/jquery.min.js"></script>
		<script type="text/javascript" src="./main.js"></script>
	</body>
</html>
