### START-MAIN ###

try
{
    $env_variables_path = [System.IO.Path]::Combine($PSScriptRoot, "ENV_VARIABLES.txt")
    $exit_code = Execute($env_variables_path)
}
catch
{
    $exit_code = 1
}

Write-Host "$exit_code"

# $path1 = [Environment]::GetEnvironmentVariable('PATH1', 'Process')
# $path2 = [Environment]::GetEnvironmentVariable('PATH2', 'Process')

# Write-Host "$path1"
# Write-Host "$path2"

EXIT $exit_code

### END-MAIN ###

function Execute
{
    [CmdletBinding()]
    param (
        [string] $file_path
    )
    process
    {
        if  (!(CheckIfFileExists($file_path))){
            return 2
        }
        
        $keyValuePairs = GetEnvPairsFromFile($file_path)

        if ($null -eq $keyValuePairs){
            return 3
        }

        if($keyValuePairs.length -eq 0){
            return 4
        }

        foreach($key in $keyValuePairs.Keys){
            [Environment]::SetEnvironmentVariable($key, $keyValuePairs[$key], 'Process')
        }
           
        return 0
    }
}

function CheckIfFileExists
{
    [CmdletBinding()]
    param (
        [string] $file_path
    )
    process
    {
        if([System.IO.File]::Exists($file_path)){
            return $true
        }
        
        Write-Host "File does not exist: $file_path"
        return $false
    }
}

function GetEnvPairsFromFile
{
    param(
        [string] $file_path
    )
    process
    {
        $reader = New-Object System.IO.StreamReader($file_path)
    
        try
        {
            $hashtable = @{}
            $line_counter = 0

            while ($null -ne ($current_line = $reader.ReadLine()))
            {
                $line_counter++
        
                $paramsArray = $current_line.Split("{;}")
                
                if  ($paramsArray.Length -ne 2)
                {
                    Write-Host "Error in line ${$line_counter}: Invalid length of params (should be 2)."
                    return $null
                }
        
                $hashtable.Add($paramsArray[0].Trim(), $paramsArray[1].Trim())
            }
        }
        finally
        {
            if ($null -ne $reader){
                $reader.Dispose()
            }         
        }
        return $hashtable
    }
}