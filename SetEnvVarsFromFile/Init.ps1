function Execute
{
    $exit_code = 0
    $env_variables_path = "C:\Git\scripts\ENV_VARIABLES.txt"
    if(![System.IO.File]::Exists($env_variables_path))
    {
        Write-Host "File does not exist: $env_variables_path"
        $exit_code
        return
    }
    
    $stream_reader = New-Object System.IO.StreamReader{C:\Git\scripts\ENV_VARIABLES.txt}
    try
    {
        $line_counter = 0
        while ($null -ne ($current_line =$stream_reader.ReadLine()) -and ![string]::IsNullOrWhiteSpace($current_line))
        {
            $line_counter++
            #Write-Host "$current_line"
    
            $pair = $current_line.Split("{;}")
            
            if  ($pair.Length -ne 2)
            {
                Write-Host "Error in line ${$line_counter}: Invalid length of params (should be 2)."
                $exit_code = 3
                return
            }
    
            for ($i=0; $i -lt $pair.Length; $i++)
            {
                $pair[$i] = $pair[$i].Trim()
                Write-Host ()
            }
    
            [Environment]::SetEnvironmentVariable($pair[0], $pair[1], 'Process')
        }
    
        if($line_counter -eq 0)
        {
            $exit_code = 2
            return
        }
    }
    finally
    {
        $stream_reader.Dispose()
    }

    return $exit_code
}

####### MAIN #######

$exit_code = Execute
Write-Host "$exit_code"

EXIT $exit_code

# $path1 = [Environment]::GetEnvironmentVariable('PATH1', 'Process')
# $path2 = [Environment]::GetEnvironmentVariable('PATH2', 'Process')

# Write-Host "$path1"
# Write-Host "$path2"